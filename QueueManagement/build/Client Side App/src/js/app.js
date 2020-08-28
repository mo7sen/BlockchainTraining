
// let ethereum = window.ethereum;
// let web3Provider = window.web3;
// if (typeof ethereum !== 'undefined') {
//  await ethereum.enable();
//  web3 = new Web3(ethereum);
// } else if (typeof web3 !== 'undefined') {
//  web3 = new Web3(web3.currentProvider);
// } else {
//  web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/d87d2b5f53884d199d3b48dc29c6458b'));
// }


App =
{
  web3Provider: null,
  contracts: {},
  account: '0x0',
  instance: null,

  init: function () 
  {
    return App.initWeb3();
  },

  initWeb3: async function () 
  {
    if (typeof web3 !== 'undefined') 
    {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      if (ethereum)
      {
        try {
          await ethereum.enable();
        } catch (e) {
          alert("You should enable ethereum to continue.");
        }
      }
    } 
    else 
    {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/d87d2b5f53884d199d3b48dc29c6458b');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () 
  {
    $.getJSON("Queue.json", function (queue) 
    {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Queue = TruffleContract(queue);
      // Connect provider to interact with contract
      App.contracts.Queue.setProvider(App.web3Provider);

      return refresh();
    });
  },
    
  reserve: function () {
    App.instance.enter()
      .then(function () {
        App.render();
      });
  },

  render: function ()
  {
    $("#loader").show();
    $("#non-queuer").hide();
    $("#queuer").hide();
    $("#turnInButton").hide(); 
    
    web3.eth.getCoinbase(function (err, account) 
    {
      if (err === null) 
      {
        App.account = account;
        $("#accountAddress").html("Your Account: " + App.account);
      }
    });

    App.contracts.Queue.deployed()
    .then(function (_instance) 
    {
      App.instance = _instance;
      return _instance.getPosition();
    })
    .then(function (pos)
    {
      if (pos == 0)
      {
        App.instance.getAll()
        .then(function (array) 
        {
          $("#non-queuer-currentStatus").html(array.length + " people are currently waiting");
          $("#non-queuer").show();
          $("#loader").hide();
        });
      }
      else if(pos == 1)
      {
        $("#queuer-currentStatus").html("Your Currently Number is : " + pos);
        $("#turn").show(); 
        $("#loader").hide();
        $("#queuer").show();
      }
      else 
      {
        $("#queuer-currentStatus").html("Your Currently Number is : " + pos);
        $("#queuer").show();
        $("#turn").hide(); 
        $("#loader").hide();
      }
    });
  }
};

$(function () 
{
  $(window).load(function () 
  {
    App.init();
  });
});

function refresh() 
{
  setTimeout(refresh, 2000);
  App.render();
}
