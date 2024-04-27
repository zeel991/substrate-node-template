import { ApiPromise, WsProvider, Keyring, SubmittableResult } from '@polkadot/api';
import { AccountId } from '@polkadot/types/interfaces';

// Utility function to wait
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Connect to the local Substrate node
  const provider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider });

  console.log('Connected to Substrate node');

  // Set up keyring to create and manage accounts
  const keyring = new Keyring({ type: 'sr25519' });

  // Create test accounts
  const alice = keyring.addFromUri('//Alice');
  const bob = keyring.addFromUri('//Bob');

  console.log(`Alice address: ${alice.address}`);
  console.log(`Bob address: ${bob.address}`);

  await sleep(5000);
  // Authorize an account
  console.log('Authorizing Bob...');
  await api.tx.templateModule.authorizeAccount(bob.address).signAndSend(bob, (result: SubmittableResult) => {
    if (result.status.isFinalized) {
      console.log(`Authorization of Bob finalized in block ${result.status.asFinalized}`);
    }
  });
  
  // Give time for the transaction to be finalized
  await sleep(5000);
  
  // Register a statement
  console.log('Registering a statement for Alice...');
  await api.tx.templateModule.registerStatement(alice.address).signAndSend(alice, (result: SubmittableResult) => {
    if (result.status.isFinalized) {
      console.log(`Statement registration finalized in block ${result.status.asFinalized}`);
    }
  });
  await sleep(8000);
  // Retrieve Alice's statement status after registration
  const aliceStatementStatus = await api.query.templateModule.statement(alice.address);
  await sleep(7000);
  console.log(`Alice's statement status after registration: ${aliceStatementStatus.toString()}`);


  // Consume a statement
  console.log('Consuming Alice\'s statement...');
  await api.tx.templateModule.consumeStatement(alice.address, bob.address).signAndSend(alice, (result: SubmittableResult) => {
    if (result.status.isFinalized) {
      console.log(`Statement consumed in block ${result.status.asFinalized}`);
    }
  });

  await sleep(5000);

  // Retrieve Alice's statement status after consumption
  const aliceStatementStatusAfterConsumption = await api.query.templateModule.statement(alice.address);
  await sleep(5000);
  console.log(`Alice's statement status after consumption: ${aliceStatementStatusAfterConsumption.toString()}`);


  await api.disconnect();
  console.log('Disconnected from Substrate node');
}

main().catch((error) => {
  console.error('Error:', error);
});
