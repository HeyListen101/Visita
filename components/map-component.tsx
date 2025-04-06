"use client";

import React, { useState, useEffect, useRef } from 'react';

const Rectangles = () => {
  const [scale, setScale] = useState(1);
  const [selectedRectangle, setSelectedRectangle] = useState<string | null>(null);
  const containerRef = useRef(null);
  const originalWidth = 2560;
  const originalHeight = 1440;
  const headerHeight = 60;
  const [hoveredRectangle, setHoveredRectangle] = useState<string | null>(null);

  const showTooltips = process.env.NEXT_PUBLIC_SHOW_TOOLTIPS === 'true';

  const isClickable = (rectangleId: string): boolean => {
    // Define which rectangles should NOT be clickable
    const nonClickableRectangles = [
      'rectangle2',
      'rectangle29',
      'rectangle30',
      'rectangle31',
      'rectangle32',
      'rectangle33',  
      'rectangle34',
      'rectangle35',
      'rectangle36',
      'rectangle37',
    ];

    return !nonClickableRectangles.includes(rectangleId);
  };

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
  
      const container = containerRef.current as HTMLDivElement;
      const availableHeight = window.innerHeight - headerHeight;
      const availableWidth = container.offsetWidth;
      
      const widthScale = availableWidth / originalWidth;
      const heightScale = availableHeight / originalHeight;
      
      setScale(Math.min(widthScale, heightScale) * 1.08);
    };
  
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const handleRectangleClick = (rectangleId: string) => {
    setSelectedRectangle(rectangleId);
    // #TODO: Implement store and product information management system here
    console.log(`Rectangle ${rectangleId} clicked`);
  };

  const getStyleWithSelection = (rectangleId: string, baseStyle: React.CSSProperties): React.CSSProperties => {
    if (selectedRectangle === rectangleId) {
      return {
        ...baseStyle,
        border: '3px solid #FFFF00', // Yellow highlight for selected rectangle
        boxShadow: '0 0 10px rgba(255, 255, 0, 0.7)',
        zIndex: 10, // Bring selected rectangle to front
      };
    }
    return baseStyle;
  };

  const styles: { [key: string]: React.CSSProperties } = {
    rectangle69: {
      position: 'absolute',
      width: '111px',
      height: '62px',
      left: '2399px',
      top: '913px',
      background: '#8AD70E',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle68: {
      position: 'absolute',
      width: '111px',
      height: '62px',
      left: '2399px',
      top: '975px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle67: {
      position: 'absolute',
      width: '111px',
      height: '63px',
      left: '2399px',
      top: '1037px',
      background: '#006600',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle66: {
      position: 'absolute',
      width: '111px',
      height: '64px',
      left: '2399px',
      top: '849px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle65: {
      position: 'absolute',
      width: '111px',
      height: '62px',
      left: '2399px',
      top: '787px',
      background: '#319900',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle64: {
      position: 'absolute',
      width: '111px',
      height: '54px',
      left: '2399px',
      top: '663px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle63: {
      position: 'absolute',
      width: '111px',
      height: '51px',
      left: '2399px',
      top: '612px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle62: {
      position: 'absolute',
      width: '111px',
      height: '53px',
      left: '2399px',
      top: '559px',
      background: '#8AD70E',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle61: {
      position: 'absolute',
      width: '111px',
      height: '51px',
      left: '2399px',
      top: '508px',
      background: '#66CC00',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle60: {
      position: 'absolute',
      width: '111px',
      height: '52px',
      left: '2399px',
      top: '456px',
      background: '#319900',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle59: {
      position: 'absolute',
      width: '111px',
      height: '51px',
      left: '2399px',
      top: '405px',
      background: '#006600',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle58: {
      position: 'absolute',
      width: '111px',
      height: '54px',
      left: '2399px',
      top: '351px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle57: {
      position: 'absolute',
      width: '111px',
      height: '51px',
      left: '2399px',
      top: '300px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle56: {
      position: 'absolute',
      width: '67px',
      height: '51px',
      left: '2043px',
      top: '179px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle55: {
      position: 'absolute',
      width: '66px',
      height: '51px',
      left: '2110px',
      top: '179px',
      background: '#319900',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle54: {
      position: 'absolute',
      width: '68px',
      height: '51px',
      left: '1975px',
      top: '179px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle53: {
      position: 'absolute',
      width: '68px',
      height: '51px',
      left: '1907px',
      top: '179px',
      background: '#8AD70E',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle52: {
      position: 'absolute',
      width: '66px',
      height: '51px',
      left: '1841px',
      top: '179px',
      background: '#66CC00',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle51: {
      position: 'absolute',
      width: '58px',
      height: '105px',
      left: '1556px',
      top: '179px',
      background: '#66CC00',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle50: {
      position: 'absolute',
      width: '213px',
      height: '640px',
      left: '1170px',
      top: '439px',
      background: '#006600',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle49: {
      position: 'absolute',
      width: '169px',
      height: '84px',
      left: '2065px',
      top: '787px',
      background: '#8AD70E',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle48: {
      position: 'absolute',
      width: '86px',
      height: '162px',
      left: '2065px',
      top: '871px',
      background: '#66CC00',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle47: {
      position: 'absolute',
      width: '83px',
      height: '162px',
      left: '2150px',
      top: '871px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle46: {
      position: 'absolute',
      width: '565px',
      height: '587px',
      left: '1446px',
      top: '439px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle45: {
      position: 'absolute',
      width: '55px',
      height: '105px',
      left: '1501px',
      top: '179px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle44: {
      position: 'absolute',
      width: '55px',
      height: '51px',
      left: '1446px',
      top: '179px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle43: {
      position: 'absolute',
      width: '58px',
      height: '51px',
      left: '1388px',
      top: '179px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle42: {
      position: 'absolute',
      width: '56px',
      height: '51px',
      left: '1332px',
      top: '179px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle41: {
      position: 'absolute',
      width: '59px',
      height: '51px',
      left: '1273px',
      top: '179px',
      background: '#66CC00',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle40: {
      position: 'absolute',
      width: '56px',
      height: '51px',
      left: '1217px',
      top: '179px',
      background: '#319900',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle39: {
      position: 'absolute',
      width: '56px',
      height: '53px',
      left: '1159px',
      top: '179px',
      background: '#006600',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle38: {
      position: 'absolute',
      width: '113px',
      height: '105px',
      left: '942px',
      top: '179px',
      background: '#66CC00',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle37: {
      position: 'absolute',
      width: '55px',
      height: '1192px',
      left: '1079px',
      top: '179px',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #D6D8D9 5%, #D6D8D9 95%, #FFFFFF 100%)',
      
    },
    rectangle36: {
      position: 'absolute',
      width: '23px',
      height: '469px',
      left: '2027px',
      top: '787px',
      background: 'rgba(153, 157, 160, 0.4)',
      borderRadius: '25px 25px 0px 0px',
      
    },
    rectangle35: {
      position: 'absolute',
      width: '24px',
      height: '817px',
      left: '1395px',
      top: '439px',
      background: 'rgba(153, 157, 160, 0.4)',
      borderRadius: '25px 25px 0px 0px',
      
    },
    rectangle34: {
      position: 'absolute',
      width: '23px',
      height: '278px',
      left: '2246px',
      top: '787px',
      background: 'rgba(153, 157, 160, 0.4)',
      borderRadius: '25px 25px 0px 0px',
      
    },
    rectangle33: {
      position: 'absolute',
      width: '1212px',
      height: '54px',
      left: '1134px',
      top: '333px',
      background: 'rgba(153, 157, 160, 0.4)',
      borderRadius: '0px 18px 0px 0px',
      
    },
    rectangle32: {
      position: 'absolute',
      width: '608px',
      height: '21px',
      left: '1419px',
      top: '1044px',
      background: 'rgba(153, 157, 160, 0.4)',
      borderRadius: '0px',
      
    },
    rectangle31: {
      position: 'absolute',
      width: '196px',
      height: '21px',
      left: '2050px',
      top: '1044px',
      background: 'rgba(153, 157, 160, 0.4)',
      borderRadius: '0px',
      
    },
    rectangle30: {
      position: 'absolute',
      width: '608px',
      height: '22px',
      left: '1419px',
      top: '1234px',
      background: 'rgba(153, 157, 160, 0.4)',
      borderRadius: '0px',
      
    },
    rectangle29: {
      position: 'absolute',
      width: '59px',
      height: '986px',
      left: '2287px',
      top: '385px',
      background: 'linear-gradient(180deg, #D6D8D9 94.51%, #FFFFFF 100%)',
      borderRadius: '0px',
      
    },
    rectangle28: {
      position: 'absolute',
      width: '79px',
      height: '70px',
      left: '1446px',
      top: '1079px',
      background: '#319900',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle27: {
      position: 'absolute',
      width: '79px',
      height: '73px',
      left: '1446px',
      top: '1149px',
      background: '#66CC00',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle26: {
      position: 'absolute',
      width: '78px',
      height: '73px',
      left: '1525px',
      top: '1149px',
      background: '#8AD70E',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle25: {
      position: 'absolute',
      width: '81px',
      height: '73px',
      left: '1603px',
      top: '1149px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle24: {
      position: 'absolute',
      width: '81px',
      height: '73px',
      left: '1684px',
      top: '1149px',
      background: '#006600',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle23: {
      position: 'absolute',
      width: '80px',
      height: '73px',
      left: '1765px',
      top: '1149px',
      background: '#319900',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle22: {
      position: 'absolute',
      width: '80px',
      height: '73px',
      left: '1841px',
      top: '1149px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle21: {
      position: 'absolute',
      width: '81px',
      height: '73px',
      left: '1921px',
      top: '1149px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle20: {
      position: 'absolute',
      width: '78px',
      height: '72px',
      left: '1525px',
      top: '1077px',
      background: '#66CC00',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle19: {
      position: 'absolute',
      width: '81px',
      height: '70px',
      left: '1603px',
      top: '1079px',
      background: '#8AD70E',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle18: {
      position: 'absolute',
      width: '76px',
      height: '72px',
      left: '1765px',
      top: '1077px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle17: {
      position: 'absolute',
      width: '161px',
      height: '70px',
      left: '1841px',
      top: '1079px',
      background: '#319900',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle16: {
      position: 'absolute',
      width: '81px',
      height: '70px',
      left: '1684px',
      top: '1079px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle15: {
      position: 'absolute',
      width: '185px',
      height: '105px',
      left: '757px',
      top: '179px',
      background: '#319900',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle14: {
      position: 'absolute',
      width: '79px',
      height: '105px',
      left: '679px',
      top: '179px',
      background: '#006600',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle13: {
      position: 'absolute',
      width: '80px',
      height: '105px',
      left: '599px',
      top: '179px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle12: {
      position: 'absolute',
      width: '115px',
      height: '105px',
      left: '484px',
      top: '179px',
      background: '#8AD70E',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle11: {
      position: 'absolute',
      width: '110px',
      height: '105px',
      left: '371px',
      top: '179px',
      background: '#F07474',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle10: {
      position: 'absolute',
      width: '112px',
      height: '105px',
      left: '257px',
      top: '179px',
      background: '#319900',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle9: {
      position: 'absolute',
      width: '113px',
      height: '51px',
      left: '140px',
      top: '179px',
      background: '#006600',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle8: {
      position: 'absolute',
      width: '55px',
      height: '158px',
      left: '50px',
      top: '230px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle7: {
      position: 'absolute',
      width: '57px',
      height: '104px',
      left: '1784px',
      top: '178px',
      background: '#319900',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle6: {
      position: 'absolute',
      width: '56px',
      height: '105px',
      left: '1728px',
      top: '179px',
      background: '#006600',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle5: {
      position: 'absolute',
      width: '56px',
      height: '105px',
      left: '1672px',
      top: '179px',
      background: '#90EE90',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle4: {
      position: 'absolute',
      width: '58px',
      height: '105px',
      left: '1614px',
      top: '179px',
      background: '#8AD70E',
      border: '1px solid #FFFFFF',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    rectangle3: {
      position: 'absolute',
      width: '250px',
      height: '105px',
      left: '2179px',
      top: '179px',
      background: '#66CC00',
      borderRadius: '5px',
    },
    rectangle2: {
      position: 'absolute',
      width: '938px',
      height: '16px',
      left: '141px',
      top: '299px',
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(153, 157, 160, 0.4) 10%)',
      borderRadius: '0px',
      
    },
    rectangle1: {
      position: 'absolute',
      width: '709px',
      height: '891px',
      left: '217px',
      top: '406px',
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '9px',
    },
  };

  const rectangleData = [
    {id:'rectangle69', style: styles.rectangle69, title: 'rectangle69', isClickable:isClickable('rectangle69')},
    {id: 'rectangle68', style: styles.rectangle68, title:'rectangle68', isClickable:isClickable('rectangle68')},
    {id: 'rectangle67', style: styles.rectangle67, title:'rectangle67', isClickable:isClickable('rectangle67')},
    {id:'rectangle66', style: styles.rectangle66, title:'rectangle66', isClickable:isClickable('rectangle66')},
    {id:'rectangle65', style: styles.rectangle65, title:'rectangle65', isClickable:isClickable('rectangle65')},
    {id:'rectangle64', style: styles.rectangle64, title:'rectangle64', isClickable:isClickable('rectangle64')},
    {id:'rectangle63', style: styles.rectangle63, title:'rectangle63', isClickable:isClickable('rectangle63')},
    {id:'rectangle62', style: styles.rectangle62, title:'rectangle62', isClickable:isClickable('rectangle62')},
    {id:'rectangle61', style: styles.rectangle61, title:'rectangle61', isClickable:isClickable('rectangle61')},
    {id:'rectangle60', style: styles.rectangle60, title:'rectangle60', isClickable:isClickable('rectangle60')},
    {id:'rectangle59', style: styles.rectangle59, title:'rectangle59', isClickable:isClickable('rectangle59')},
    {id:'rectangle58', style: styles.rectangle58, title:'rectangle58', isClickable:isClickable('rectangle58')},
    {id:'rectangle57', style: styles.rectangle57, title:'rectangle57', isClickable:isClickable('rectangle57')},
    {id:'rectangle56', style: styles.rectangle56, title:'rectangle56', isClickable:isClickable('rectangle56')},
    {id:'rectangle55', style: styles.rectangle55, title:'rectangle55', isClickable:isClickable('rectangle55')},
    {id:'rectangle54', style: styles.rectangle54, title:'rectangle54', isClickable:isClickable('rectangle54')},
    {id:'rectangle53', style: styles.rectangle53, title:'rectangle53', isClickable:isClickable('rectangle53')},
    {id:'rectangle52', style: styles.rectangle52, title:'rectangle52', isClickable:isClickable('rectangle52')},
    {id:'rectangle51', style: styles.rectangle51, title:'rectangle51', isClickable:isClickable('rectangle51')},
    {id:'rectangle50', style: styles.rectangle50, title:'rectangle50', isClickable:isClickable('rectangle50')},
    {id:'rectangle49', style: styles.rectangle49, title:'rectangle49', isClickable:isClickable('rectangle49')},
    {id:'rectangle48', style: styles.rectangle48, title:'rectangle48', isClickable:isClickable('rectangle48')},
    {id:'rectangle47', style: styles.rectangle47, title:'rectangle47', isClickable:isClickable('rectangle47')},
    {id:'rectangle46', style: styles.rectangle46, title:'rectangle46', isClickable:isClickable('rectangle46')},
    {id:'rectangle45', style: styles.rectangle45, title:'rectangle45', isClickable:isClickable('rectangle45')},
    {id:'rectangle44', style: styles.rectangle44, title:'rectangle44', isClickable:isClickable('rectangle44')},
    {id:'rectangle43', style: styles.rectangle43, title:'rectangle43', isClickable:isClickable('rectangle43')},
    {id:'rectangle42', style: styles.rectangle42, title:'rectangle42', isClickable:isClickable('rectangle42')},
    {id:'rectangle41', style: styles.rectangle41, title:'rectangle41', isClickable:isClickable('rectangle41')},
    {id:'rectangle40', style: styles.rectangle40, title:'rectangle40', isClickable:isClickable('rectangle40')},
    {id:'rectangle39', style: styles.rectangle39, title:'rectangle39', isClickable:isClickable('rectangle39')},
    {id:'rectangle38', style: styles.rectangle38, title:'rectangle38', isClickable:isClickable('rectangle38')},
    {id:'rectangle37', style: styles.rectangle37, title:'rectangle37', isClickable:isClickable('rectangle37')},
    {id:'rectangle36', style: styles.rectangle36, title:'rectangle36', isClickable:isClickable('rectangle36')},
    {id:'rectangle35', style: styles.rectangle35, title:'rectangle35', isClickable:isClickable('rectangle35')},
    {id:'rectangle34', style: styles.rectangle34, title:'rectangle34', isClickable:isClickable('rectangle34')},
    {id:'rectangle33', style: styles.rectangle33, title:'rectangle33', isClickable:isClickable('rectangle33')},
    {id:'rectangle32', style: styles.rectangle32, title:'rectangle32', isClickable:isClickable('rectangle32')},
    {id:'rectangle31', style: styles.rectangle31, title:'rectangle31', isClickable:isClickable('rectangle31')},
    {id:'rectangle30', style: styles.rectangle30, title:'rectangle30', isClickable:isClickable('rectangle30')},
    {id:'rectangle29', style: styles.rectangle29, title:'rectangle29', isClickable:isClickable('rectangle29')},
    {id:'rectangle28', style: styles.rectangle28, title:'rectangle28', isClickable:isClickable('rectangle28')},
    {id:'rectangle27', style: styles.rectangle27, title:'rectangle27', isClickable:isClickable('rectangle27')},
    {id:'rectangle26', style: styles.rectangle26, title:'rectangle26', isClickable:isClickable('rectangle26')},
    {id:'rectangle25', style: styles.rectangle25, title:'rectangle25', isClickable:isClickable('rectangle25')},
    {id:'rectangle24', style: styles.rectangle24, title:'rectangle24', isClickable:isClickable('rectangle24')},
    {id:'rectangle23', style: styles.rectangle23, title:'rectangle23', isClickable:isClickable('rectangle23')},
    {id:'rectangle22', style: styles.rectangle22, title:'rectangle22', isClickable:isClickable('rectangle22')},
    {id:'rectangle21', style: styles.rectangle21, title:'rectangle21', isClickable:isClickable('rectangle21')},
    {id:'rectangle20', style: styles.rectangle20, title:'rectangle20', isClickable:isClickable('rectangle20')},
    {id:'rectangle19', style: styles.rectangle19, title:'rectangle19', isClickable:isClickable('rectangle19')},
    {id:'rectangle18', style: styles.rectangle18, title:'rectangle18', isClickable:isClickable('rectangle18')},
    {id:'rectangle17', style: styles.rectangle17, title:'rectangle17', isClickable:isClickable('rectangle17')},
    {id:'rectangle16', style: styles.rectangle16, title:'rectangle16', isClickable:isClickable('rectangle16')},
    {id:'rectangle15', style: styles.rectangle15, title:'rectangle15', isClickable:isClickable('rectangle15')},
    {id:'rectangle14', style: styles.rectangle14, title:'rectangle14', isClickable:isClickable('rectangle14')},
    {id:'rectangle13', style: styles.rectangle13, title:'rectangle13', isClickable:isClickable('rectangle13')},
    {id:'rectangle12', style: styles.rectangle12, title:'rectangle12', isClickable:isClickable('rectangle12')},
    {id:'rectangle11', style: styles.rectangle11, title:'rectangle11', isClickable:isClickable('rectangle11')},
    {id:'rectangle10', style: styles.rectangle10, title:'rectangle10', isClickable:isClickable('rectangle10')},
    {id:'rectangle9', style: styles.rectangle9, title:'rectangle9', isClickable:isClickable('rectangle9')},
    {id:'rectangle8', style: styles.rectangle8, title:'rectangle8', isClickable:isClickable('rectangle8')},
    {id:'rectangle7', style: styles.rectangle7, title:'rectangle7', isClickable:isClickable('rectangle7')},
    {id:'rectangle6', style: styles.rectangle6, title:'rectangle6', isClickable:isClickable('rectangle6')},
    {id:'rectangle5', style: styles.rectangle5, title:'rectangle5', isClickable:isClickable('rectangle5')},
    {id:'rectangle4', style: styles.rectangle4, title:'rectangle4', isClickable:isClickable('rectangle4')},
    {id:'rectangle3', style: styles.rectangle3, title:'rectangle3', isClickable:isClickable('rectangle3')},
    {id:'rectangle2', style: styles.rectangle2, title:'rectangle2', isClickable:isClickable('rectangle2')},
    {id:'rectangle1', style: styles.rectangle1, title:'rectangle1', isClickable:isClickable('rectangle1')},
  ];

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}>
      <div
        style={{
          position: 'absolute',
          width: `${originalWidth}px`,
          height: `${originalHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center top',
          left: '50%',
          marginLeft: `-${originalWidth / 2}px`,
          top: '-0.5rem',
        }}
      >
        {rectangleData.map(rect => (
        <div
          key={rect.id}
          style={rect.isClickable ? getStyleWithSelection(rect.id, rect.style) : rect.style}
          onClick={isClickable(rect.id) ? () => handleRectangleClick(rect.id) : undefined}
          onMouseEnter={rect.isClickable ? () => setHoveredRectangle(rect.id) : undefined}
          onMouseLeave={rect.isClickable ? () => setHoveredRectangle(null) : undefined}
          title={showTooltips && rect.isClickable ? rect.title : undefined}
          role={rect.isClickable ? "Button" : undefined}
          tabIndex={rect.isClickable ? 0 : undefined}
          onKeyDown={rect.isClickable ? (e) => e.key === 'Enter' && handleRectangleClick(rect.id) : undefined}
          className={rect.isClickable ? "cursor-pointer transition-opacity duration-200 hover:opacity-80" : "pointer-events-none"}
        ></div>
      ))}
    </div>
  </div>
);
}
export default Rectangles;
