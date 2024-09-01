import {Route, Routes} from 'react-router-dom';
import {AppLayout} from '../layout';
import {Top} from '../pages/top';
import {Create} from '../pages/create';
import {Deck} from '../pages/deck';
import {DeckEdit} from '../pages/deck/edit';
import { Compare } from '@/pages/compare';

export const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Top />} />
        <Route path="/create" element={<Create />} />
        <Route path="/deck" element={<Deck />} />
        <Route path="/deck/:id" element={<DeckEdit />} />
        <Route path="/compare" element={<Compare />} />
      </Route>
    </Routes>
  );
};
