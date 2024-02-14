import { v4 as uuidv4 } from 'uuid';

/**
 * Desired Input Structure
 */
export interface InputJson {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

/**
 * Desired Output Structure
 */
export interface TransferTxOutput {
  id: string;
  accountId: string;
  toAddress: string;
  fromAddress: string;
  type: string;
  amount: string;
  symbol: string;
  decimal: number;
  timestamp: string;
  txnHash: string;
}

/**
 * Converts an inputJson representing transfer transaction records to desired formatted output.
 * @param inputJson 
 * @param accountAddress 
 * @returns 
 */
export function formatTransferTxJsonObject(inputJson: InputJson, accountAddress: string): TransferTxOutput {
  const id = uuidv4(); // Generate a random alphanumeric of 32 characters
  const accountId = uuidv4() + '-n1'; // generate a random id and post-fix it 

  const toAddress = inputJson.to;
  const fromAddress = inputJson.from;

  // figure out whether the transfer was deposit or withdrawal
  const type = toAddress === accountAddress ? 'deposit' : 'withdrawal';

  // Convert value to amount with 18 decimal places
  const decimal = Number(inputJson.tokenDecimal);
  const amount = convertToDecimalAmount(inputJson.value, decimal);

  const symbol = inputJson.tokenSymbol;

  // Convert timeStamp to UTC timestamp
  const timestamp = new Date(Number(inputJson.timeStamp) * 1000).toISOString();

  const txnHash = inputJson.hash;

  const output: TransferTxOutput = {
    id,
    accountId,
    toAddress,
    fromAddress,
    type,
    amount,
    symbol,
    decimal,
    timestamp,
    txnHash,
  };

  return output;
}

/**
 * Convert an array of transfer transactions to the desired output format.
 * @param inputJsonArray 
 * @param accountAddress 
 * @returns 
 */
export function formatTransferTxJsonArray(inputJsonArray: InputJson[], accountAddress: string): TransferTxOutput[] {
  return inputJsonArray.map((inputJson) => formatTransferTxJsonObject(inputJson, accountAddress));
}


// Given long integer formats along with decimal value output a correctly represented decimal number 
export function convertToDecimalAmount(inputString: string, decimalAmount: number): string {
    const stringValue = inputString.toString();
    const integerPart = stringValue.slice(0, -decimalAmount) || '0';
    const fractionalPart = stringValue.slice(-decimalAmount);

    const formattedAmount = `${integerPart}.${fractionalPart}`;
    return parseFloat(formattedAmount).toFixed(decimalAmount);
}

/**
 * Filter transfer transactions by token symbol
 */
export function filterByTokenSymbol(transactions: TransferTxOutput[], tokenSymbol: string): TransferTxOutput[] {
    if (typeof tokenSymbol === 'string') {
        return transactions.filter(transaction => transaction.symbol === tokenSymbol);
      } else {
        console.log("got here");
        // If tokenSymbol is undefined or not a string, return the original array
        return transactions;
      }
}
  