// Test para verificar si Number.parseFloat funciona con números pequeños
const testValue = "0.00001274";
const parsed = Number.parseFloat(testValue);

console.log("Original:", testValue);
console.log("Parsed:", parsed);
console.log("Type:", typeof parsed);
console.log("Is NaN:", isNaN(parsed));
console.log("Is > 0:", parsed > 0);
console.log("toString():", parsed.toString());
console.log("toFixed(8):", parsed.toFixed(8));

// Test con JSON
const jsonTest = JSON.stringify({ bolivares_to_soles: parsed });
console.log("JSON:", jsonTest);

const jsonParsed = JSON.parse(jsonTest);
console.log("JSON parsed:", jsonParsed.bolivares_to_soles);