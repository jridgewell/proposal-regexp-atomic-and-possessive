# proposal-regexp-atomic-and-possessive

A proposal to add Atomic Groups and Possessive Quantifiers to `RegExp`s.

## Atomic Groups

Atomic groups, denoted by `(?>TEXT_TO_MATCH)`, prevent backtracking once
the group matches and "locks". Even if backtracking into an alternate
branch could allow a full match, the atomic group will not unlock.

```js
const atomic = /a(?>bc|b)c/;

// (?>bc) matches, so atomic group "locks".
// Then, the "c" after the group matches.
atomic.test('abcc'); // => true

// (?>bc) matches, so atomic group "locks".
// The rest of the expression no longer matches.
// Because the atomic group is locked, it will **not** backtrack
// to the alternate (b) branch.
atomic.test('abc'); // => false

// Atomic groups do not capture their match.
atomic.exec('abcc'); // => ['abcc']
```

## Possessive Quantifiers

Possessive quantifiers, denoted by using `+` after a quantifier, prevent
backtracking once the token has matched. Even if backtracking would
allow a full match, the possessive quantifier will not allow it.

```js
const possessive = /^(a|.b)++$/;

// (a) matches
possessive.test('a'); // => true
// (a) matches, then (.b) matches
possessive.test('abb'); // => true

// (a) matches, (a) matches, but we can't match "b"
// Because it's possessive, it will not **not** backtrack
// to the (.b) branch.
possessive.test('aab'); // => false
```

## Motivation

JavaScript's Regular Expressions are great, but developers can
unintentionally write one with "catastrophic backtracking". These regexs
can completely freeze the program, and is especially dangerous for
servers.

Atomic Groups and Possessive Quantifiers allow developers to write
understandable performance guarantees. Since they do not allow
backtracking, they'll never suffer exponential execution time.

```js
const regex = /^(a|[ab])*$/;

function test(length) {
  const str = 'a'.repeat(length) + 'c';
  const now = performance.now();
  regex.test(str);
  return performance.now() - now;
}

for (let i = 0; i < 50; i++) {
  console.log({ length: i, time: test(i) });
}
```

| String Length | Execution Time |
|--------------:|---------------:|
|             0 |           0.00 |
|             1 |           0.00 |
|             2 |           0.00 |
|             3 |           0.00 |
|             4 |           0.00 |
|             5 |           0.00 |
|             6 |           0.00 |
|             7 |           0.00 |
|             8 |           0.00 |
|             9 |           0.00 |
|            10 |           0.00 |
|            11 |           0.00 |
|            12 |           0.00 |
|            13 |           0.00 |
|            14 |           0.00 |
|            15 |           0.00 |
|            16 |           0.00 |
|            17 |           0.00 |
|            18 |           0.00 |
|            19 |           0.01 |
|            20 |           0.01 |
|            21 |           0.03 |
|            22 |           0.06 |
|            23 |           0.11 |
|            24 |           0.23 |
|            25 |           0.44 |
|            26 |           0.89 |
|            27 |           1.79 |
|            28 |           3.65 |
|            29 |           7.32 |
|            30 |          14.29 |
|            31 |          28.45 |
|            32 |          57.94 |
|            33 |         114.02 |
|            34 |         233.58 |
| I got bored waiting...         |

## Champions

- Justin Ridgewell ([@jridgewell](https://github.com/jridgewell/))

## Status

Current [Stage](https://tc39.es/process-document/): 0

## Motivation


## Related

- [Atomic Grouping](https://www.regular-expressions.info/atomic.html)
- [Possessive Quantifiers](https://www.regular-expressions.info/possessive.html)
