# Nodara Network API Gateway

> **Decentralized Mobile Infrastructure Protocol** - Rent verifiable functions from smartphones worldwide and pay per use in SOL/SPL tokens.

[![GitHub](https://img.shields.io/badge/GitHub-nodara--network-blue?style=flat-square&logo=github)](https://github.com/nodara-network/)
[![Website](https://img.shields.io/badge/Website-nodara.network-green?style=flat-square&logo=world)](https://nodara.network)
[![Solana](https://img.shields.io/badge/Built%20on-Solana-purple?style=flat-square&logo=solana)](https://solana.com)

## What is Nodara Network?

Nodara Network is a **DePIN (Decentralized Physical Infrastructure)** protocol that transforms smartphones into a global network of verifiable microservices. Think of it as **AWS Lambda powered by smartphones** - developers can request location proofs, sensor data, connectivity tests, and other services from nearby phones, paying only for successful execution.

## API Gateway Overview

The **Nodara API Gateway** serves as the central orchestration layer that connects service requesters with mobile device providers. It handles task routing, device discovery, payment coordination, and result aggregation across our decentralized network.

## Contributing

We welcome contributions to the Nodara Network API Gateway. Please read our contributing guidelines and feel free to submit issues, feature requests, or pull requests.

### Development Setup

```bash
git clone https://github.com/nodara-network/api-gateway
cd api-gateway
yarn install
yarn run dev
```

### Repository Structure

```
api-gateway/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── lib/             # Library files
└── .env                 # Environment variables
```


## License

MIT License - see [LICENSE](LICENSE) file for details.

## Ecosystem Links

- **Protocol Docs**: [docs.nodara.network](https://docs.nodara.network)
- **Web Dashboard**: [github.com/nodara-network/dashboard](https://github.com/nodara-network/dashboard)
- **Mobile SDK**: [github.com/nodara-network/mobile-sdk](https://github.com/nodara-network/mobile-sdk)
- **API Gateway**: [github.com/nodara-network/api-gateway](https://github.com/nodara-network/api-gateway)