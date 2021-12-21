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
    </div>
  </Page>
);

export default HomePage;
