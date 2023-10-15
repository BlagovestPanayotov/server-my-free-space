const getRandomUrl = () => {
  return (Math.random().toString(32) + Math.random().toString(32) + Math.random().toString(32) + Math.random().toString(32)).replaceAll('.', '');
};

const getAccountName = (currentGuestNumber) => {

  const currentNumber = currentGuestNumber.toString();
  const accountName = 'Guest' + (currentNumber.length < 8 ? '0'.repeat(8 - currentNumber.length) + currentNumber : currentNumber);

  return accountName;
};

// const getRandomPass = () => {
//   let pass = '';

//   for (let i = 0; i < 4; i++) {
//     pass += Math.floor(Math.random() * 10);
//   }

//   return pass;
// };

module.exports = {
  // getRandomPass,
  getRandomUrl,
  getAccountName
};