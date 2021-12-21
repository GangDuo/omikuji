import React from 'react';

import localforage from 'localforage';
import ons from 'onsenui';
import {
  Page,
  Toolbar,
  ToolbarButton,
  Icon,
  Tab,
  Tabbar,
  Splitter,
  SplitterSide,
  SplitterContent,
} from 'react-onsenui';

import HistoryPage from './HistoryPage';
import HomePage from './HomePage';
import SideBar from './SideBar';
import ORACLES from './Oracles';
import Omikuji from './Omikuji';
import OmikujiConfig from './OmikujiConfig';

interface Score {
  createdAt: string;
  fortune: string;
  id: number;
  oracle: string;
}

interface State {
  title: string;
  scores: Score[];
  index: number;
  imgNum: number;
  cName: string;
  oracle: string;
  disable: boolean;
  drawerOpen: boolean;
  count: number;
}

interface Props {
  title: string;
  scores: Score[];
  index: number;
  imgNum: number;
  cName: string;
  oracle: string;
  disable: boolean;
  drawerOpen: boolean;
  count: number;
}

localforage.config({
  driver      : localforage.LOCALSTORAGE,
  name        : 'omikuji',
});

const FORTUNES = ['大吉', '吉', '中吉', '小吉', '末吉', '凶', '大凶'];
const TITLES = ['ホーム', '履歴'];

class App extends React.Component {
  public state: State = {
    title: 'ホーム',
    scores: [],
    index: 0,
    imgNum: 0,
    cName: 'App-logo',
    oracle: 'おみくじボタンをタップ！',
    disable: false,
    drawerOpen: false,
    count: 0,
  };

  public componentDidMount(): void {
    localforage
      .getItem('omikuji-20200801')
      .then((value): void => {
        if (!value) {
          this.setState({ scores: [] });
        } else {
          this.setState({ scores: value });
        }
      })
      .catch((err): void => console.error(err));
  }

  public componentDidUpdate(_prevProps: Props, prevState: State): void {
    if (this.state.scores !== prevState.scores) {
      localforage
        .setItem('omikuji-20200801', this.state.scores)
        .catch((err): void => console.error(err));
    }
  }

  private renderToolbar = (): JSX.Element => (
    <Toolbar>
      <div className="left">
        <ToolbarButton onClick={this.toggleDrawer}>
          <Icon icon="md-menu" />
        </ToolbarButton>
      </div>
      <div className="center">{this.state.title}</div>
    </Toolbar>
  );

  private renderTabs = (): { content: JSX.Element; tab: JSX.Element }[] => {
    return [
      {
        content: (
          <HomePage
            key="Home"
            omikuji={this.handleOnClick}
            imgNum={this.state.imgNum}
            cName={this.state.cName}
            oracle={this.state.oracle}
            disable={this.state.disable}
          />
        ),
        tab: <Tab key="Home" label="ホーム" icon="md-home" />,
      },
      {
        content: <HistoryPage key="settings" scores={this.state.scores} />,
        tab: <Tab key="settings" label="履歴" icon="md-time" />,
      },
    ];
  };

  private increment = (): void => {
    this.setState((prev: State): { count: number } => {
      return {
        count: prev.count + 1,
      };
    });
  };

  private onReload = (): void => {
    OmikujiConfig.getInstance().reset()
      .then(_ => {
        window.location.reload();
      }).catch(e => {
        ons.notification.alert(e);
      })
  };
  private openDrawer = (): void => {
    this.setState({ drawerOpen: true });
  };
  private closeDrawer = (): void => {
    this.setState({ drawerOpen: false });
  };
  private toggleDrawer = (): void => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  private onDeleteHistory = (): void => {
    this.setState({
      imgNum: 0,
      cName: 'App-logo',
      oracle: 'おみくじボタンをタップ！',
      scores: [],
      count: 0,
    });
    localforage
      .setItem('omikuji-20190501', this.state.scores)
      .catch((err): void => {
        console.error(err);
      });
    this.closeDrawer();
  };

  private handleOnConfirm = (): void => {
    ons.notification.confirm({
      title: '(´･ω･`)',
      message: '本当に消しちゃうの？',
      buttonLabels: ['いいえ', 'はい'],
      cancelable: true,
      callback: (index: number): void => {
        if (index === 1) {
          this.onDeleteHistory();
        }
      },
    });
    this.closeDrawer();
  };

  private handleOnClick = async (): Promise<void> => {
    this.increment();
    this.setState({
      imgNum: 0,
      cName: 'Running',
      disable: !this.state.disable,
    });
    const config = await OmikujiConfig.getInstance().generateFortuneConfig();
    const omikuji = new Omikuji(config);
    const fortune = omikuji.execute();
    const oracle = Math.floor(Math.random() * ORACLES[0].length);
    const newItem = {
      fortune: fortune.id,
      createdAt: new Date().toLocaleString(),
      id: new Date().getTime(),
      oracle: ORACLES[0][oracle],
    };
    await OmikujiConfig.getInstance().decrement(fortune.id);
    setTimeout((): void => {
      const imgNum = config.findIndex(x => x.id === fortune.id) + 1;
      this.setState({
        scores: [newItem, ...this.state.scores],
        imgNum: imgNum,
        cName: 'fortune',
        oracle: newItem.oracle,
        disable: !this.state.disable,
      });
    }, 800);
  };

  public render(): JSX.Element {
    return (
      <Page renderToolbar={this.renderToolbar}>
        <Splitter>
          <SplitterSide
            side="left"
            width={250}
            collapse={true}
            swipeable={true}
            isOpen={this.state.drawerOpen}
            onClose={this.closeDrawer}
            onOpen={this.openDrawer}>
            <SideBar
              onReload={this.onReload}
              onConfirm={this.handleOnConfirm}
            />
          </SplitterSide>
          <SplitterContent>
            <Tabbar
              renderTabs={this.renderTabs}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onPreChange={({ index }): void =>
                this.setState({
                  index: index,
                  title: TITLES[index],
                })
              }
              index={this.state.index}
              swipeable
            />
          </SplitterContent>
        </Splitter>
      </Page>
    );
  }
}

export default App;
