const SocketActions = require('./constants');

const Transaction = require('./models/transaction');
const Blockchain = require('./models/chain');

const socketListeners = (socket, chain) => {
  socket.on(SocketActions.ADD_TRANSACTION, (sender, receiver, amount) => {
    const transaction = new Transaction(sender, receiver, amount);
    chain.newTransaction(transaction);
    console.info(`Transação adicionada: ${JSON.stringify(transaction.getDetails(), null, '\t')}`);
  });

  socket.on(SocketActions.END_MINING, (newChain) => {
    console.log('Fim da mineração encontrado');
    process.env.BREAK = true;
    const blockChain = new Blockchain();
    blockChain.parseChain(newChain);
    if (blockChain.checkValidity() && blockChain.getLength() >= chain.getLength()) {
      chain.blocks = blockChain.blocks;
    }
  });

  return socket;
};

module.exports = socketListeners;