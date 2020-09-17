/* eslint-disable no-undef */
before('Switch the node environment to TEST', function () {
  process.env.NODE_ENV = 'TEST';
});

after('Switch the node environment back to PROD', function () {
  process.env.NODE_ENV = 'PROD';
});
