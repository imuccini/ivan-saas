# Technical Documentation

This document provides a technical overview of the Network Integrations and Networks creation processes for the AI coding agent.

## Network Integrations

Network integrations are managed by the services defined in `packages/api/modules/networks/integrations.ts`. This module handles the full lifecycle of integrations, including their creation, listing, and deletion.

### Integration Management

-   **Creation**: New integrations are added via the `createIntegration` function, which securely handles provider credentials by encrypting the API key before storage. Each integration is linked to a specific workspace and requires user authentication to ensure authorized access.
-   **Listing**: The `listIntegrations` function retrieves a list of all integrations for a given workspace. It enriches this list with real-time data, such as network and access point counts, by interacting with external provider APIs (e.g., Meraki). For security, credential decryption is performed on-the-fly and only when necessary.
-   **Deletion**: The `deleteIntegration` function allows for the secure removal of integrations, ensuring that all associated data and credentials are properly deleted from the system.

### Provider Adapters

To support multiple network providers, the system uses an adapter-based architecture. Each provider has its own adapter responsible for encapsulating the logic of API interactions. For example, `packages/api/modules/networks/adapters/meraki-adapter.ts` contains all the logic required to communicate with the Meraki API.

### Adding a New Provider

To add a new provider, follow these steps:

1.  **Create a New Adapter**: Develop a new class in the `packages/api/modules/networks/adapters/` directory that implements the provider-specific logic for API authentication and data fetching.
2.  **Update Integration Services**: Modify the functions in `integrations.ts` to include the new provider as a supported option. This may require adding new logic to handle unique credential structures or API endpoints.
3.  **Implement Data Fetching**: Ensure that the `listIntegrations` function is updated to correctly retrieve and display data from the new provider, including network and access point counts.

### Security and Credentials

All credentials are encrypted using the functions in `packages/api/lib/encryption.ts` before being stored in the database. The system is designed to minimize exposure by decrypting credentials only when required for API interactions.

## Network Creation and Provisioning

The network provisioning process is handled by the services in `packages/api/modules/networks/network-provisioning.ts`. This module is responsible for creating and updating network records in the database, ensuring they remain synchronized with external providers.

### Provisioning Workflow

1.  **Data Synchronization**: The `provision` function takes a list of networks from an external provider and syncs them with the local database. It checks if a network already exists by matching the `integrationId` and `externalId`.
2.  **Creating and Updating**:
    -   If a network does not exist, a new record is created with the provided configuration and metadata.
    -   If a network already exists, its information is updated to reflect any changes from the provider.
3.  **Status Management**: The `provisioningStatus` field is updated to `active` for all provisioned networks, indicating they are successfully synced and operational.

### Network Management

-   **Listing Networks**: The `list` function in `packages/api/modules/networks/networks.ts` retrieves all networks associated with a given workspace. It includes detailed information about each network, such as the integration provider and its current configuration.
-   **Configuration Storage**: The `config` field in the `Network` model is designed to store the full network object from the provider, allowing for flexibility and ensuring no data is lost during the synchronization process.
