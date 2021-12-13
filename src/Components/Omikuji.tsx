import FortuneConfig from './FortuneConfig';

export default class Omikuji {
    constructor(private config: FortuneConfig[]) {
    }

    execute(): FortuneConfig {
        return this.config[0];
    }
}