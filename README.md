## :potable_water: Nem Faucet

Nem Faucet is a simple web application it allow user to request [testnet](https://testnet-explorer.nemtool.com) XEM for development, it build on [Next.js](https://nextjs.org/docs).

## Requirement
- Node.js 12.22.0 or later

## Installation

1. Clone the project.

```
git clone https://github.com/NemProject/faucet.git
```

2. Install the required dependencies.

```
cd faucet
npm install
```

## Development

1. Create `.env.local` in root directory.
```env
NEM_PRIVATE_KEY=<faucet_private_key>
NEXT_PUBLIC_NEM_ADDRESS=<faucet_address>
NEXT_PUBLIC_MAX_BALANCE=<max_balance> // max recipient balance eg: 200000000 (200 XEM)
NEXT_PUBLIC_MAX_SEND_AMOUNT=<max_send_amount> max send out amount. eg 500000000 (500 XEM)
NEXT_PUBLIC_EXPLORER=<testnet_explorer_url>
NEXT_PUBLIC_DIVISIBILITY=6
```

2. running in development
```
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building instructions

```
npm run build
```

## Contributing

Before contributing please [read the CONTRIBUTING instructions](CONTRIBUTING.md).

## Getting Help

- [NEM Developer Documentation](https://nemproject.github.io/nem-docs).
- [NEM Technical Reference](https://nemproject.github.io/nem-docs/pages/Whitepapers/NEM_techRef.pdf).
- Join the community [Discord server](https://discord.gg/xymcity).
- If you found a bug, [open a new issue](https://github.com/NemProject/faucet/issues).

## License

Copyright (c) 2014-2022 NEM Contributors, licensed under the [MIT license](LICENSE).
