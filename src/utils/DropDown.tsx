import React, { useEffect, useRef, useState } from 'react';
import { Weapon } from '../stores/types/weapons';
import { Spell } from '../stores/types/spells';
// import { Weapon } from "../stores/types/weapons";
type DropdownProps = {
  options: Weapon[] | Spell[];
  value: Weapon | Spell;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  id,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const headerRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const arrowDownPrefix = '<label>&#9660;</label> ';

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        listRef.current &&
        headerRef.current &&
        !listRef.current.contains(event.target as Node) &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const updateHeader = () => {
    if (headerRef.current) {
      headerRef.current.innerHTML =
        arrowDownPrefix + (value?.name || 'Seleccionar');
    }
  };

  useEffect(() => {
    updateHeader();
  }, [value]);

  return (
    <div className="dropdown-container">
      <select
        id={id}
        ref={selectRef}
        className="rpgui-dropdown"
        value={value?.id || ''}
        onChange={(e) => {
          const selectedOption = options.find(
            (option) => option.id === e.target.value
          );
          if (selectedOption) onChange(selectedOption);
        }}
        disabled={disabled}
        style={{ display: 'none' }}
      >
        <option value="">Seleccionar</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      <p
        id={id ? `${id}-rpgui-dropdown-head` : undefined}
        className="rpgui-dropdown-imp rpgui-dropdown-imp-header"
        ref={headerRef}
        onClick={toggleDropdown}
        dangerouslySetInnerHTML={{
          __html: arrowDownPrefix + (value?.name || 'Seleccionar'),
        }}
      />

      <ul
        id={id ? `${id}-rpgui-dropdown` : undefined}
        className="rpgui-dropdown-imp listSize"
        ref={listRef}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {options.map((option) => (
          <li
            key={option.id}
            onClick={() => handleOptionClick(option)}
            dangerouslySetInnerHTML={{ __html: option.name }}
          />
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;