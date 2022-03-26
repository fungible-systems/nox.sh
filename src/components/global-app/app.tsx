import { Header } from './header';
import { MicroStacksWrapper } from './micro-stacks-wrapper';
import { AppWrapper } from './app-wrapper';
import { Routes } from './routes';
import 'modern-normalize/modern-normalize.css';

function App() {
  return (
    <MicroStacksWrapper>
      <AppWrapper>
        <Header />
        <Routes />
      </AppWrapper>
    </MicroStacksWrapper>
  );
}

export default App;
