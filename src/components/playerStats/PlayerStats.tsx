import './PlayerStats.css';
import { useAnimateExclamationMark } from '../../utils/animateExclamationMark';
import LeftColumnPStats from './leftColumn';
import MediumColumnPStats from './mediumColumn';
import RightColumnPStats from './rightColumn';
export default function PlayerStats() {
  useAnimateExclamationMark();
  return (
    <section className="sectionPlayer rpgui-container framed-golden-2">
      <div className="container containerPlayer ">
        <LeftColumnPStats />
        <MediumColumnPStats />
        <RightColumnPStats />
      </div>
    </section>
  );
}
