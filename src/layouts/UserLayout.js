import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon, Divider } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.png';
import getPageTitle from '@/utils/getPageTitle';
import moment from 'moment';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];
const copyright = (
  <Fragment>
    <span style={{color:"rgba(255,255,255,0.6)"}}>Copyright <Icon type="copyright" /> 2019 中船重工· 鹏力塑造有限公司 版权所有</span> <br />
    <span style={{color:"rgba(255,255,255,0.6)"}}>备案序号：苏ICP备12025462号 </span>
  </Fragment>
);

class UserLayout extends Component {
  constructor(props) {
    super(props);
    let time = moment(new Date().getTime()).format("YYYY-MM-DD | HH:mm:ss");
    this.state = {
      time: this.getArrTime(time)
    }
  }

  getArrTime(time){
    let arr = []
    for(let i=0;i<time.length;i++){
      arr.push(time[i]);
    }
    return arr
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    this.t = setInterval(() => {
      let time = moment(new Date().getTime()).format("YYYY-MM-DD | HH:mm:ss");
      this.setState({
        time:this.getArrTime(time)
      })  
    }, 1000);
    /* canvas bac*/
    let canvas = document.querySelector('canvas');
    let c = canvas.getContext('2d'),
      innerHeight = window.innerHeight,
      innerWidth = window.innerWidth;

    canvas.height = innerHeight;
    canvas.width = innerWidth;



    // Declarations --------------------
    let mouse = {
      x: 0,
      y: 0
    };
    // Utilities ----------------------

    function randomIntFromRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }


    // Bubbles -------------------------
    class Bubbles {
      constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = {
          bg: 'rgba(255, 255, 255, 0.45)'
        };
        this.velocity = {
          x: (Math.random() - 0.5) * 0.5,
          y: Math.random() * 2
        };
        this.opacity = 1;
      }
    }
    Bubbles.prototype.draw = function () {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color.bg;
      c.fill();
      c.closePath();
    };
    Bubbles.prototype.update = function () {
      this.y -= this.velocity.y;
      this.draw();
    };


    // Mini Bubbles ---------------

    class miniBubbles {
      constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = {
          bg: 'rgba(255, 255, 255, 0.45)',
        };
        this.velocity = {
          x: (Math.random() - 0.5) * 0.6,
          y: (Math.random() - 1) * 0.5
        }
        this.gravity = -0.03;
        this.timeToLive = 200;
      }
    }
    miniBubbles.prototype.draw = function () {
      c.save();
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color.bg;
      c.fill();
      c.closePath();
      c.restore();
    }
    miniBubbles.prototype.update = function () {
      if (this.y - this.radius < 0) {
        this.velocity.y = this.velocity.y;
      } else {
        this.velocity.y += this.gravity;
      }
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.timeToLive -= 1;
      this.draw();
    }

    const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
    backgroundGradient.addColorStop(0, '#a0d4ff')
    backgroundGradient.addColorStop(1, '#287fc6')
    let bubbles = [];
    let minibubbles = [];
    let timer = 0;
    let spawnRate = 44;

    function init() {
      bubbles = [];
      minibubbles = [];
    }

    function animate() {
      requestAnimationFrame(animate);
      //background linear gradient ------------
      c.fillStyle = backgroundGradient;
      c.fillRect(0, 0, canvas.width, canvas.height);

      // Render the Bubbles -------------------
      bubbles.forEach((bubble, index) => {
        bubble.update();
        if (bubble.radius == 0) {
          bubbles.splice(index, 1);
        }
      });
      minibubbles.forEach((minibubble, index) => {
        minibubble.update();
        if (minibubble.timeToLive == 0) {
          minibubbles.splice(index, 1);
        }
      });

      timer++;
      if (timer % spawnRate == 0) {
        const radius = randomIntFromRange(15, 30);
        const minradius = Math.random() * 2 + 1;
        // const radius = 15;
        const x = Math.max(radius, Math.random() * canvas.width - radius);
        const y = innerHeight + 100;
        bubbles.push(new Bubbles(x, y, radius, 'white'));
        minibubbles.push(new miniBubbles(x, y, minradius));
        spawnRate = randomIntFromRange(70, 200);
      }


      //  When Hover over the bubbles ------------------
      for (let i = 0; i < bubbles.length; i++) {
        if (
          mouse.x > bubbles[i].x - bubbles[i].radius &&
          mouse.x < bubbles[i].x + bubbles[i].radius
        ) {
          if (
            mouse.y > bubbles[i].y - bubbles[i].radius &&
            mouse.y < bubbles[i].y + bubbles[i].radius
          ) {
            let x = bubbles[i].x;
            let y = bubbles[i].y;
            let radius = Math.random() * 2 + 1;
            bubbles[i].radius -= bubbles[i].radius;
            for (let a = 0; a < Math.random() * 4 + 1; a++) {
              minibubbles.push(new miniBubbles(x, y, radius));
            }
          }
        }
      }
    }


    // Event Listener ---------------

    canvas.addEventListener('mousemove', mouseMove);

    function mouseMove(e) {
      mouse.x = e.offsetX;
      mouse.y = e.offsetY;
    }
    window.addEventListener('resize', function () {
      canvas.height = document.body.clientHeight;
      canvas.width =  document.body.clientWidth;
      init();
    });

    //  call ---------------
    animate();
    init();
  }
  componentWillUnmount(){
    clearInterval(this.t);
  }
  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    let { time } = this.state;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <canvas></canvas>
          <p className={styles.timetable}>
            <Icon type="clock-circle"
              style={{ float: "left", marginTop: 4, marginRight: 10 }} />
            {
              time.map((item, i) => {
                return !item || item == "|" ? <span key={i} className={styles.jiange}></span> : <span key={i} className={styles.zifu}>{item}</span>
              })
            }
          </p>


          <div className={styles.content}>
            {children}
          </div>
          <div style={{position:"absolute",bottom:24,display:"flex",justifyContent:"center",alignContent:"center",width:"100%",color:"#fff",maxWidth:450,left:0,right:0,margin:"auto"}}>
            <GlobalFooter style={{ position: "absolute", zIndex: 100, bottom: 24 }} copyright={copyright} />
          </div> 
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
