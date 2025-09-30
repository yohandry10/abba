-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'client');
CREATE TYPE user_status AS ENUM ('pending_kyc', 'active', 'suspended');
CREATE TYPE order_status AS ENUM ('pending', 'payment_uploaded', 'confirmed', 'completed', 'cancelled');
CREATE TYPE order_type AS ENUM ('soles_to_bolivares', 'bolivares_to_soles');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  status user_status NOT NULL DEFAULT 'pending_kyc',
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- KYC documents table
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'dni_front', 'dni_back', 'selfie'
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id)
);

-- Exchange rates table
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  soles_to_bolivares DECIMAL(10, 4) NOT NULL,
  bolivares_to_soles DECIMAL(10, 4) NOT NULL,
  published_by UUID NOT NULL REFERENCES users(id),
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_type order_type NOT NULL,
  amount_send DECIMAL(12, 2) NOT NULL,
  amount_receive DECIMAL(12, 2) NOT NULL,
  exchange_rate DECIMAL(10, 4) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  
  -- Sender information
  sender_name TEXT NOT NULL,
  sender_bank TEXT NOT NULL,
  sender_account TEXT NOT NULL,
  
  -- Receiver information
  receiver_name TEXT NOT NULL,
  receiver_bank TEXT NOT NULL,
  receiver_account TEXT NOT NULL,
  receiver_document TEXT NOT NULL,
  
  -- Payment proof
  payment_proof_url TEXT,
  payment_uploaded_at TIMESTAMPTZ,
  
  -- Admin actions
  confirmed_by UUID REFERENCES users(id),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Notes
  client_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX idx_exchange_rates_active ON exchange_rates(is_active, published_at DESC);
CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- KYC documents policies
CREATE POLICY "Users can view their own KYC documents" ON kyc_documents
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can upload their own KYC documents" ON kyc_documents
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all KYC documents" ON kyc_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Exchange rates policies
CREATE POLICY "Anyone can view active exchange rates" ON exchange_rates
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage exchange rates" ON exchange_rates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Clients can view their own orders" ON orders
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Clients can create orders" ON orders
  FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update their own pending orders" ON orders
  FOR UPDATE USING (
    client_id = auth.uid() AND status IN ('pending', 'payment_uploaded')
  );

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
