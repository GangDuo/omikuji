import localforage from 'localforage';

import FortuneConfig from './FortuneConfig';

interface Config {
  id: string;
  total: number;
  probability: number;
}
  
export default class OmikujiConfig {
  private static instance: OmikujiConfig;
  private static localStore: LocalForage;

  private constructor() {}

  private async getConfig(): Promise<Config[] | null> {
    const defaultConf: Config[] = [
      { id: '超大吉', total: 1, probability: 5 },
      { id: '大大吉', total: 5, probability: 10 },
      { id: '大吉', total: 10, probability: 50 },
      { id: '中吉', total: 20, probability: 200 },
      { id: '吉', total: 99999, probability: 735 },
    ];
    try {
      let val: Config[] | null = await OmikujiConfig.localStore.getItem('config');
      if(!val) {
        await OmikujiConfig.localStore.setItem("config", defaultConf);
        val = defaultConf;
      }
      return val;
    } catch (err) {
      console.error(err)
    }
    return null;
  };

  static getInstance(): OmikujiConfig {
    if (!OmikujiConfig.instance) {
      OmikujiConfig.instance = new OmikujiConfig();
      
      OmikujiConfig.localStore = localforage.createInstance({
        driver: localforage.LOCALSTORAGE,
        name: "omikuji"
      });
    }
    return OmikujiConfig.instance;
  }

  async generateFortuneConfig(): Promise<FortuneConfig[]> {
    const max = 1000;
    const conf: Config[] = await this.getConfig() || [];
    const availableConf = conf.filter(x => x.total > 0).map(x => ({id: x.id, val: x.probability}))
    const a = availableConf.find(x => x.id === '吉')
    if(a) {
      const padding = availableConf.map(x => x.val).reduce((ax, x) => ax + x, 0);
      a.val += (max - padding);
    }
    return availableConf;
  };

  async decrement(key: string): Promise<void> {
    try {
      const conf: Config[] = await this.getConfig() || [];
      for (const row of conf) {
        if(row.id === key && row.total > 0) {
          --row.total;
        }
      }
      await OmikujiConfig.localStore.setItem("config", conf);
    } catch (err) {
        // This code runs if there were any errors.
        console.log(err);
    }
  };
}