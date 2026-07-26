import { updateContentSecurityPolicy } from './content_security_policy.ts';


const files = [
  'dist/index.html',
  'dist/index-dev.html',
  'dist/land.html'
];

let failed = false;

for (const file of files) {
  const html = await Bun.file(file).text();
  if (updateContentSecurityPolicy(html) !== html) {
    console.error(`${file}: Content Security Policy is missing or stale`);
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
}
