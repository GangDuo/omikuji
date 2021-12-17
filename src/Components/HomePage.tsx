import React from 'react';

import { Page, Button, Card, Icon } from 'react-onsenui';

interface Props {
  omikuji: (e?: React.MouseEvent<HTMLElement>) => void;
  imgNum: number;
  cName: string;
  oracle: string;
  disable: boolean;
}

const IMAGES = [
  'images/fukumikuji.jpg',
  'images/1.jpg',
  'images/2.jpg',
  'images/3.jpg',
  'images/4.jpg',
  'images/5.jpg',
];

const HomePage: React.FC<Props> = (props) => (
  <Page>
    <div className="container">
      <div className="omikuji-container">
        <img src={IMAGES[props.imgNum]} alt="logo" className={props.cName} />
      </div>
      <div className="button-container">
        <Button onClick={props.omikuji} disabled={props.disable ? true : false}>
          <Icon icon="fa-tags" style={{ marginRight: 5 }} />
          おみくじ
        </Button>
      </div>
      <div className="card-container">
        <Card>
          <div className="card-header">
            <Icon
              icon="md-face"
              size={24}
              style={{ color: '#e91e63', marginRight: 10 }}
            />
            きょうの占い
          </div>
          <div className="card-content">
            <p>{props.oracle}</p>
          </div>
        </Card>
      </div>
    </div>
  </Page>
);

export default HomePage;
