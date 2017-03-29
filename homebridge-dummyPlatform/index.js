var Accessory, Service, Characteristic, UUIDGen;
//regist platform
module.exports = function(homebridge){

	// Accessory must be created from PlatformAccessory Constructor
    Accessory = homebridge.platformAccessory;

	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	UUIDGen = homebridge.hap.uuid;
	// homebridge.registerAccessory("homebridge-dummyPlatform", "DummyPlatform", DummyPlatform, true);
	homebridge.registerPlatform("homebridge-dummyPlatform", "DummyPlatform", DummyPlatform, true);
}
// Platform constructor
// config may be null
// api may be null if launched from old homebridge version
function DummyPlatform(log, config, api) {
	this.log = log;
	this.config = config;
  	this.accessories = [];
	//realtime polling info
	this.switchState = false;

	if (api) {
		// Save the API object as plugin needs to register new accessory via this object.
		this.api = api;
		// Listen to event "didFinishLaunching", this means homebridge already finished loading cached accessories
		// Platform Plugin should only register new accessory that doesn't exist in homebridge after this event.
		// Or start discover new accessories
		this.api.on('didFinishLaunching', function() {
			this.log("DidFinishLaunching");
			this.addAccessory();
		}.bind(this));
  }
}

DummyPlatform.prototype = {

	//status input/output for light
	setSwitchPowerState: function(powerOn, callback) {
		this.log('set switch state' + powerOn);
		this.switchState = powerOn;
		callback();
	},

	getSwitchPowerState: function(callback) {
		callback(null, this.switchState);
	},

	identify: function(callback) {
		this.log("Identify requested!");
		callback(); // success
	},

	addAccessory: function() {
		this.log("Add Accessory");
		var platform = this;
		var uuid;

		uuid = UUIDGen.generate("Realank Light");

		var newAccessory = new Accessory("Realank Light", uuid);
		newAccessory.on('identify', function(paired, callback) {
			platform.log(newAccessory.displayName, "Identify!!!");

			callback();
		});
		// Plugin can save context on accessory
		// To help restore accessory in configureAccessory()
		// newAccessory.context.something = "Something"

		// Make sure you provided a name for service otherwise it may not visible in some HomeKit apps.
		var informationService = newAccessory.getService(Service.AccessoryInformation);
		if (informationService) {
			this.log("update information");
			informationService
			.updateCharacteristic(Characteristic.Manufacturer, "Dummy Manufacturer")
			.updateCharacteristic(Characteristic.Model, "Dummy Model")
			.updateCharacteristic(Characteristic.SerialNumber, "Dummy Serial Number");
		}

		newAccessory.addService(Service.Lightbulb, "Realank Lightbulb")
		.getCharacteristic(Characteristic.On)
		.on('get', function(callback) {callback(null, this.switchState)})
		.on('set',  this.setSwitchPowerState.bind(this));
		// newAccessory.addService(informationService)

		if (!this.accessories[newAccessory.UUID]) {
			this.api.registerPlatformAccessories("homebridge-dummyPlatform", "DummyPlatform", [newAccessory]);
		}
		
		this.accessories[newAccessory.UUID] = newAccessory;

		this.log("Add Accessory Done");
	},

	configureAccessory : function(accessory) {
		this.log(accessory.displayName, "Configure Accessory");
		this.accessories[accessory.UUID] = accessory;
		this.log(accessory.displayName, "Configure Accessory Done");
	},



};
