import { Header } from './header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

export const Layout = props => (
  <div style={layoutStyle}>
    <Header />
    { props.children }
  </div>
)