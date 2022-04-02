import * as React from 'react';

const IconAir: React.ForwardRefRenderFunction<SVGSVGElement, React.SVGProps<SVGSVGElement>> = (
  props,
  ref,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 19"
    {...props}
    ref={ref}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.984.335A.734.734 0 0 1 6.6 0h1.233l.042.001a1.149 1.149 0 0 1 .836.437l5.74 6.953 2.647-.07c.19-.01.71-.013.856-.013 1.068 0 2.01.142 2.715.451C21.368 8.066 22 8.628 22 9.5c0 .873-.634 1.436-1.332 1.743-.705.31-1.647.454-2.714.454-.146 0-.665-.004-.855-.014l-2.648-.07-5.752 6.95A1.145 1.145 0 0 1 7.82 19H6.6a.729.729 0 0 1-.668-1.032l2.954-6.497-4.435-.1-1.617 1.954-.011.015c-.079.1-.231.293-.467.412-.255.128-.523.133-.707.133H.83c-.09 0-.551-.011-.758-.464a.808.808 0 0 1-.066-.424c.009-.079.027-.145.038-.183l.909-3.245a.73.73 0 0 1 .023-.07.014.014 0 0 0 0-.01.73.73 0 0 1-.024-.072L.043 6.16v-.002a.901.901 0 0 1-.03-.386.769.769 0 0 1 .77-.654h.864c.383 0 .88.152 1.192.548l1.585 1.92 4.46-.066-2.952-6.487a.729.729 0 0 1 .052-.698zm1.853 1.344 2.776 6.1a.835.835 0 0 1-.391 1.102.843.843 0 0 1-.383.087l-5.56.082a1.106 1.106 0 0 1-.887-.413L1.705 6.592h-.001a.158.158 0 0 0-.02-.007l.672 2.41a1.47 1.47 0 0 1 0 .996l-.68 2.432h.005l.01-.011.008-.01 1.725-2.084a1.108 1.108 0 0 1 .887-.411l5.532.123a.86.86 0 0 1 .834.777.852.852 0 0 1-.071.426l-2.756 6.06 5.653-6.831a.793.793 0 0 1 .259-.213 1.005 1.005 0 0 1 .439-.105h.02l2.928.078.025.001c.124.007.618.012.78.012.963 0 1.677-.134 2.121-.33.45-.197.458-.367.458-.405 0-.038-.006-.207-.455-.403-.443-.195-1.158-.328-2.124-.328a24.942 24.942 0 0 0-.806.014l-2.968.077a.82.82 0 0 1-.687-.329L7.837 1.68zM1.45 13.229v-.002.002z"
      clipRule="evenodd"
    />
  </svg>
);

export default React.forwardRef(IconAir);