App =
	{
		web3Provider: null,
		contracts: {},
		account: '0x0',
		instance: null,

		init: function () {
			return App.initWeb3();
		},

		initWeb3: async function () {
			if (typeof web3 !== 'undefined') {
				// If a web3 instance is already provided by Meta Mask.
				App.web3Provider = web3.currentProvider;
				web3 = new Web3(web3.currentProvider);
				if (ethereum) {
					try {
						await ethereum.enable();
					} catch (e) {
						alert("You should enable ethereum to continue.");
					}
				}
			}
			else {
				// Specify default instance if no web3 instance provided
				App.web3Provider = new Web3.providers.HttpProvider('https://kovan.infura.io/v3/294d32392aad44e5bcbf948fc25e9780');
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

				return refresh();
			});
		},

		AddAdmin: function()
		{
			
			var inputVal = document.getElementById("myInput").value;


var len = inputVal.length;

			if(len == 42)
			{
			App.instance.addAdmin(inputVal);
			}
			
		},

		RemoveAdmin: function(){

			var inputVal = document.getElementById("myInput").value;

var len = inputVal.length;

			if(len == 42)
			{
			App.instance.removeAdmin(inputVal);
			}
		},

		next: function () {
			App.instance.next(1).then(function()
				{
					App.render();
				});
		},

		reserve: function () {
			App.instance.enter()
				.then(function () {
					App.render();
				});
		},

		render: function () {
			web3.eth.getCoinbase(function (err, account) {
				if (err === null) {
					App.account = account;
					$("#accountAddress").html("Your Account: " + App.account);
				}
			});

			App.contracts.Queue.deployed()
				.then(function (_instance) {
					App.instance = _instance;

					return _instance.isAdmin(App.account);
				})
				.then(function (_isAdmin) {
					if (_isAdmin) 
					{
						App.contracts.Queue.deployed()
							.then(function (_instance) 
								{
									App.instance = _instance;
									return _instance.getPosition();
								})
							.then(function (pos)
								{
									App.instance.getQueueSize()
										.then(function (array) 
											{
												$("#server-currentStatus").html(array + " people are currently waiting");
												$("#content").show();
												$("#loader").hide();
											});

								});
						$("#loader").hide();
						$("#client").hide(); 
						$("#server").show();          
					}
					else {
						App.contracts.Queue.deployed()
							.then(function (_instance) {
								App.instance = _instance;
								return _instance.getPosition();
							})
							.then(function (pos) {
								if (pos == 0) {
									App.instance.getQueueSize() 
										.then(function (array) 
									{ $("#non-queuer-currentStatus").html(array + " people are currently waiting");
											$("#non-queuer").show();
											
											$("#queuer").hide();
											$("#turn").hide();
										});
								}
								else if (pos == 1) {
									$("#queuer-currentStatus").html("Your Currently Number is : " + pos);
									$("#turn").show();
									$("#queuer").show();
									$("#non-queuer").hide();
								}
								else {
									$("#queuer-currentStatus").html("Your Currently Number is : " + pos);
									$("#queuer").show();
									$("#non-queuer").hide();
									$("#turn").hide();
								}
								$("#loader").hide();
								$("#client").show();
								$("#server").hide();
							});
					}
				});
		}
	}



$(function () {
	$(window).load(function () {
		App.init();
	});
});

function refresh() {
	setTimeout(refresh, 1000);
	App.render();
};
//App =
//	{
//		web3Provider: null,
//		contracts: {},
//		account: '0x0',
//		instance: null,

//		init: function () 
//		{
//			return App.initWeb3();
//		},

//		initWeb3: async function () 
//		{
//			if (typeof web3 !== 'undefined') 
//			{
//				// If a web3 instance is already provided by Meta Mask.
//				App.web3Provider = web3.currentProvider;
//				web3 = new Web3(web3.currentProvider);
//				if (ethereum)
//				{
//					try {
//						await ethereum.enable();
//					} catch (e) {
//						alert("You should enable ethereum to continue.");
//					}
//				}
//			} 
//			else 
//			{
//				// Specify default instance if no web3 instance provided
//				App.web3Provider = new Web3.providers.HttpProvider('https://kovan.infura.io/v3/294d32392aad44e5bcbf948fc25e9780');
//				web3 = new Web3(App.web3Provider);
//			}
//			return App.initContract();
//		},

//		initContract: function () 
//		{
//			$.getJSON("Queue.json", function (queue) 
//				{
//					// Instantiate a new truffle contract from the artifact
//					App.contracts.Queue = TruffleContract(queue);
//					// Connect provider to interact with contract
//					App.contracts.Queue.setProvider(App.web3Provider);

//					return refresh();
//				});
//		},

//		reserve: function () {
//			App.instance.enter()
//				.then(function () {
//					App.render();
//				});
//		},

//		render: function ()
//		{
//			web3.eth.getCoinbase(function (err, account) 
//				{
//					if (err === null) 
//					{
//						App.account = account;
//						$("#accountAddress").html("Your Account: " + App.account);
//					}
//				});

//			//promise to return if admin or not
//			if(1)
//			{
//				$("#loader").hide();
//				$("#server").show();
//			}
//			else 
//			{
//				App.contracts.Queue.deployed()
//					.then(function (_instance) 
//						{
//							App.instance = _instance;

//							return _instance.isAdmin(account);
//						})
//					.then(function(_isAdmin)
//						{
//							if(isAdmin)
//							{

//							}
//							else
//							{
//								App.contracts.Queue.deployed()
//									.then(function (_instance) 
//										{
//											App.instance = _instance;
//											return _instance.getPosition();
//										})
//									.then(function (pos)
//										{
//											if (pos == 0)
//											{
//												App.instance.getAll()
	//													.then(function (array) 
//														{
	//															$("#non-queuer-currentStatus").html(array.length + " people are currently waiting");
	//															$("#non-queuer").show();

	//														});
	//											}
//											else if(pos == 1)
//											{
//												$("#queuer-currentStatus").html("Your Currently Number is : " + pos);
	//												$("#turn").show(); 
//												$("#queuer").show();
//											}
//											else 
//											{
	//												$("#queuer-currentStatus").html("Your Currently Number is : " + pos);
	//												$("#queuer").show();

//											}
//											$("#loader").hide();
//											$("#client").show();
//										});
//							}
//						});
//			}
//		}
//	}


//$(function () 
//	{
	//		$(window).load(function () 
//			{
	//				App.init();
//			});
//	});

//function refresh() 
//{
//	setTimeout(refresh, 2000);
//	App.render();
	//};
