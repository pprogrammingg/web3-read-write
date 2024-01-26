import express, { Request, Response} from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { convertToDecimalAmount, filterByTokenSymbol, formatTransferTxJsonArray } from './utils';

const app = express();
const port = 3000;

/**
 * Get all ERC-20 transfers in and out of an account
*/
app.get('/get-token-transactions', async (req: Request, res: Response) => {
    const apiKey = '26Y7IBZ8M1IG48RZY1KH32PDZQZVF2VTSS';
    // const contractAddress = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2';
    // const accountAddress = '0x9A9F1F7B50A4bA8adFE136cf660ee7d8836fc075';
    // console.log(`accountAddress is ${ req.query.accountAddress } page is ${req.query.page }`);
    const accountAddress = req.query.accountAddress as string || '0x9A9F1F7B50A4bA8adFE136cf660ee7d8836fc075'; // have a default account
    const page = req.query.page as string || '1'; // Default to page 1 if not provided
    const tokenSymbol = req.query.tokenSymbol as string;
    console.log(`accountAddress is ${accountAddress} page is ${page} token symbol ${tokenSymbol}`);
  
    try {
      console.log('Making request to Etherscan API for token transactions...');
  
      const response = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'tokentx',
          address: accountAddress,
          page: page,
          offset: 100,
          startblock: 0,
          endblock: 27025780,
          sort: 'desc',
          apikey: apiKey,
        },
      });
  
      console.log('Etherscan API response called by /get-token-transactions:', response.data);
  
      const transactions = response.data.result;

      // format the response json
      let formattedTransactions = formatTransferTxJsonArray(transactions, accountAddress);

      // filter token symbol
      let filteredTransactions = filterByTokenSymbol(formattedTransactions, tokenSymbol);

      //return output
      res.json({ data: filteredTransactions, count: filteredTransactions.length });
    } catch (error: any) {
      console.error('Error fetching token transfer transactions:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to fetch all transfer transactions and write to a JSON file
// app.get('/get-all-transfer-transactions', async (req: Request, res: Response) => {
//     const accountAddress = req.query.accountAddress as string || '0x9A9F1F7B50A4bA8adFE136cf660ee7d8836fc075' ;
  
//     if (!accountAddress) {
//       res.status(400).json({ error: 'Missing accountAddress parameter' });
//       return;
//     }
  
//     try {
//       await fetchAllTransactions(accountAddress);
//       res.json({ message: 'All transfer transactions fetched and written to file.' });
//     } catch (error: any) {
//       console.error('Error fetching all transfer transactions:', error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
// });





app.listen(port, () => {
    console.log(`Server ius running on http://localhost:${port}`);
});




