// TypeScript debugging test file
function fibonacci(n: number): number {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function processNumbers(numbers: number[]): void {
  console.log('Processing numbers:', numbers);

  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    const result = fibonacci(num);
    console.log(`fibonacci(${num}) = ${result}`);
  }
}

function main(): void {
  const testNumbers = [5, 8, 3, 10];
  console.log('Starting TypeScript debugging test');

  processNumbers(testNumbers);

  console.log('Test completed');
}

main();