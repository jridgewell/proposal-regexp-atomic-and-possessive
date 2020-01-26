const regex = /^(a|[ab])*$/;

function test(length) {
  const str = 'a'.repeat(length) + 'c';
  const now = process.uptime();
  regex.test(str);
  return process.uptime() - now;
}

console.log(`| String Length | Execution Time |`);
console.log(`|--------------:|---------------:|`);
for (let i = 0; i < 50; i++) {
  const length = `${i}`.padStart(13);
  const time = test(i).toFixed(2).padStart(14);
  console.log(`| ${length} | ${time} |`);
}

