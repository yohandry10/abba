-- Arreglar la precisión de las columnas numeric en exchange_rates
ALTER TABLE exchange_rates 
ALTER COLUMN soles_to_bolivares TYPE NUMERIC(20,10),
ALTER COLUMN bolivares_to_soles TYPE NUMERIC(20,10);

-- Verificar los tipos de datos
SELECT column_name, data_type, numeric_precision, numeric_scale
FROM information_schema.columns 
WHERE table_name = 'exchange_rates' 
AND column_name IN ('soles_to_bolivares', 'bolivares_to_soles');

-- Insertar una tasa de prueba para verificar
INSERT INTO exchange_rates (
    soles_to_bolivares, 
    bolivares_to_soles, 
    published_by, 
    is_active
) VALUES (
    75.5000,
    0.00001274,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
    false
);

-- Verificar que se guardó correctamente
SELECT soles_to_bolivares, bolivares_to_soles 
FROM exchange_rates 
ORDER BY published_at DESC 
LIMIT 1; 