import FortuneConfig from './FortuneConfig';

export default class Omikuji {
    constructor(private config: FortuneConfig[]) {
        if(config.length === 0) {
            throw new Error();
        }
    }

    execute(): FortuneConfig {
        const config = this.config;
        const min = 1; // 最小値
        const max = 1000; // 最大値
    
        // 乱数生成（抽選）
        const randomNum = Math.floor(Math.random() * (max + 1 - min)) + min;
    
        let result = config[config.length - 1];
        let total = 0;
        for (let i = 0; i < config.length; i++) {
            total += config[i].val;
            if( randomNum <= total ) {
                result = config[i];
                break;
            }
        };
    
        return result;
    }
}