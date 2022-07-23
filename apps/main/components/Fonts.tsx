import { Global } from "@emotion/react"
const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Nunito';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
      }
    `}
  />
)

export default Fonts