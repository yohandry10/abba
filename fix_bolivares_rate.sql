-- Arreglar la tasa bolivares_to_soles que está en 0
UPDATE exchange_rates 
SET bolivares_to_soles = 0.01328
WHERE is_active = true AND bolivares_to_soles = 0;

-- Verificar que se actualizó
SELECT 
    id,
    soles_to_bolivares, 
    bolivares_to_soles, 
    is_active,
    published_at
FROM exchange_rates 
WHERE is_active = true;