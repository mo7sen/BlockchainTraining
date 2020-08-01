App = 
{
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Queue.json", function (queue) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Queue = TruffleContract(queue);
      // Connect provider to interact with contract
      App.contracts.Queue.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function () 
  {
    var instance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function (err, account) 
    {
      if (err === null) 
      {
        App.account = account;
        $("#accountAddress").html("Your Account: " + App.account);
      }
    });

    // Load contract data
    App.contracts.Queue.deployed()
    .then(function (_instance) 
    {
      var pos = _instance.getPosition({ from: App.account });
      return pos;
    })
    .then(function(pos)
    {
      $("#candidatesResults").html("Current Waiting: " + pos);
      loader.hide();
      content.show();
    });
  },

  Reserve: function () 
  {
    App.contracts.Queue.deployed()
    .then(function (_instance)
    {
      _instance.enter({});
      return pos = _instance.getPosition({ from: App.account });
    })
      .then(function (pos) 
    {
        $("#candidatesResults").html("Your Position: " + pos);
    })
    .then(function (pos) 
    {
      $("#content").hide();
      $("#content").show();

    })
  },
};


$(function () 
{
  $(window).load(function () {
    App.init();
  });
});