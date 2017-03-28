var Service, Characteristic;
var SwithSer,switchOn = true;
//regist accessory
module.exports = function(homebridge){
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-dummy", "Dummy", HttpDummy, true);
}

//create accessory class
function HttpDummy(log, config) {
	this.log = log;
	//realtime polling info
	this.switchState = false;
	this.lightState = false;
	this.currentlevel = 0;
	this.doorState = false;
	this.motionState = false;
}

HttpDummy.prototype = {

	//status input/output for light
	setSwitchPowerState: function(powerOn, callback) {
		this.log('set switch state' + powerOn);
		this.switchState = powerOn;
		callback();
	},

	getSwitchPowerState: function(callback) {
		callback(null, this.switchState);
	},

	setLightPowerState: function(powerOn, callback) {
		this.log('set light state' + powerOn);
		this.lightState = powerOn;
		callback();
		// this.switchService.setCharacteristic(Characteristic.On,powerOn);
	},

	getLightPowerState: function(callback) {
		callback(null, this.lightState);
	},

	getBrightness: function(callback) {
		callback(null, this.currentlevel);
	 },

	setBrightness: function(level, callback) {

		this.currentlevel = level;
		callback();
	},

	getDoorbell: function(callback) {
		callback(null,this.doorState)
	},

	getMotionSensor: function(callback) {
		callback(null,this.motionState)
	},

	identify: function(callback) {
		this.log("Identify requested!");
		callback(); // success
	},

	//declare services
	getServices: function() {
		this.log("======get service");
		var that = this;

		// you can OPTIONALLY create an information service if you wish to override
		// the default values for things like serial number, model, etc.
		var informationService = new Service.AccessoryInformation();

		informationService
		.setCharacteristic(Characteristic.Manufacturer, "Dummy Manufacturer")
		.setCharacteristic(Characteristic.Model, "Dummy Model")
		.setCharacteristic(Characteristic.SerialNumber, "Dummy Serial Number");

		//switch
		this.switchService = new Service.Switch("Switch");
		SwithSer = this.switchService;
		this.log("Create Switch");
		this.switchService
		.getCharacteristic(Characteristic.On)
		.on('get', function(callback) {callback(null, that.switchState)})
		.on('set', this.setSwitchPowerState.bind(this));

		// lightbulb
		this.lightbulbService = new Service.Lightbulb("LightBulb");
		this.log("Create Light");
		this.lightbulbService.getCharacteristic(Characteristic.On).eventEnabled = true;
		this.lightbulbService
		.getCharacteristic(Characteristic.On)
		.on('get', function(callback) {callback(null, that.lightState)})
		.on('set', this.setLightPowerState.bind(this));
		
		this.lightbulbService
		.addCharacteristic(new Characteristic.Brightness())
		.on('get', function(callback) {callback(null, that.currentlevel)})
		.on('set', this.setBrightness.bind(this));

		this.doorbellService = new Service.SmokeSensor("Smoke");
		this.doorbellService
		.getCharacteristic(Characteristic.SmokeDetected)
		.on('get', this.getDoorbell.bind(this))

		this.motionService = new Service.MotionSensor("Motion Sensor");
		this.motionService
		.getCharacteristic(Characteristic.MotionDetected)
		.on('get', this.getMotionSensor.bind(this))

		//smoke sensor trigger
		// setInterval(function() {
	 //        this.log("Smoke");
	 //        this.doorState = !this.doorState
	 //        this.doorbellService.getCharacteristic(Characteristic.SmokeDetected).setValue(this.doorState);
  //   	}.bind(this), 10000);

  		//motion sensor trigger
  		// setInterval(function() {
	   //      this.log("motion");
	   //      this.motionState = !this.motionState
	   //      this.motionService.getCharacteristic(Characteristic.MotionDetected).setValue(this.motionState);
    // 	}.bind(this), 10000);

		return [informationService,this.switchService,this.lightbulbService, this.doorbellService, this.motionService];
	}
};

// randomize our temperature reading every 3 seconds
setInterval(function() {
  switchOn = !switchOn
  // SwithSer.setCharacteristic(Characteristic.On,switchOn);
  SwithSer.getCharacteristic(Characteristic.On).updateValue(switchOn,null);
}, 3000);
