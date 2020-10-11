import { ZigBeeAccessory } from '../zig-bee-accessory';
import { Service } from 'homebridge';
import { DeviceState } from '../../zigbee/types';
import { Device } from 'zigbee-herdsman/dist/controller/model';
import { ProgrammableSwitchServiceBuilder } from '../../builders/programmable-switch-service-builder';

export class XiaomiWirelessSwitch extends ZigBeeAccessory {
  protected switchServiceOn: Service;
  protected batteryService: Service;

  getAvailableServices(): Service[] {
    const builder = new ProgrammableSwitchServiceBuilder(
      this.platform,
      this.accessory,
      this.client,
      this.state
    );

    const ProgrammableSwitchEvent = this.platform.Characteristic.ProgrammableSwitchEvent;
  
[
  this.this.switchServiceOn, 
  this.batteryService
] = builder
      .withStatelessSwitch('ON/OFF', 1, [
        ProgrammableSwitchEvent.SINGLE_PRESS,
        ProgrammableSwitchEvent.LONG_PRESS,
      ])
      .andBattery()
      .build();

    return [
      this.switchServiceOn, 
      this.batteryService,
    ];
  }

  update(device: Device, state: DeviceState) {
    const ProgrammableSwitchEvent = this.platform.Characteristic.ProgrammableSwitchEvent;
    super.update(device, state);
    switch (state.click) {
      case 'on':
        this.switchServiceOn
          .getCharacteristic(ProgrammableSwitchEvent)
          .setValue(ProgrammableSwitchEvent.SINGLE_PRESS);
        break;
       case 'on':
        this.switchServiceOn
          .getCharacteristic(ProgrammableSwitchEvent)
          .setValue(ProgrammableSwitchEvent.LONG_PRESS);
        break;
    }
  }
}
