
```markdown
# Project Name

## Description
This project implements a ticket-based system using the Substrate framework. Each ticket issued is registered on the blockchain, and only authorized accounts can change the ticket state. Once a ticket is used, the authorized account can change the ticket state to "consumed". The logic for this functionality is implemented in a Substrate pallet named "useonce".

## Features
- Ticket registration on the blockchain.
- Authorization mechanism to control ticket state changes.
- State transition from "registered" to "consumed" upon ticket usage.

## Installation
To install and run this project, follow these steps:

1. **Clone the repository:** 
   ```bash
   git clone https://github.com/zeel991/substrate-node-template.git
   ```

2. **Navigate to the project directory:** 
   ```bash
   cd substrate-node-template
   ```

3. **Install dependencies:** 
   ```bash
   npm install
   ```

4. **Build the Pallet:** 
   ```bash
   cargo build --release
   ```

5. **Start the local node:** 
   ```bash
   ./target/release/node-template --dev
   ```

6. **In a second terminal, navigate to the `substrate-demo` directory:**
   ```bash
   cd substrate-demo
   ```
7. **Build Yarn:** 
   ```bash
   yarn build
   ```

8. **Run the demo script:** 
   ```bash
   yarn demo
   ```

## Usage
To interact with and demonstrate the functionality of the "useonce" pallet, follow these steps:

1. Import the necessary modules and functions.
2. Initialize the Substrate client.
3. Connect to the Substrate node.
4. Use the provided TypeScript code to perform ticket-related tasks, such as issuing tickets, changing ticket states, and querying ticket information.
5. Run the TypeScript code to execute the tasks and observe the results.
