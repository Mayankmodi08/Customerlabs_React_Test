
import './App.css';
import { Segment } from './component/Segment';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
    <Segment/>
    </ChakraProvider>
  );
}

export default App;
