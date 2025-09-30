-- Primero, arreglar la precisión de las columnas
ALTER TABLE exchange_rates 
ALTER COLUMN soles_to_bolivares TYPE NUMERIC(20,10),
ALTER COLUMN bolivares_to_soles TYPE NUMERIC(20,10);

-- Desactivar todas las tasas actuales
UPDATE exchange_rates SET is_active = false WHERE is_active = true;

-- Insertar una tasa correcta inmediatamente
INSERT INTO exchange_rates (
    soles_to_bolivares, 
    bolivares_to_soles, 
    published_by, 
    is_active,
    published_at
) VALUES (
    75.3220,
    0.01328,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
    true,
    NOW()
);

-- Verificar que se insertó correctamente
SELECT 
    id,
    soles_to_bolivares, 
    bolivares_to_soles, 
    is_active,
    published_at
FROM exchange_rates 
WHERE is_active = true
ORDER BY published_at DESC 
LIMIT 1;