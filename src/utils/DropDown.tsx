import React, { useEffect, useRef, useState } from 'react';
// import { Weapon } from "../stores/types/weapons";
type DropdownProps = {
  options: (string | undefined)[];
  value: string;
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

  const handleOptionClick = (option: string, index: number) => {
    if (selectRef.current) {
      selectRef.current.selectedIndex = index;
      onChange(option);
      setIsOpen(false);
    }
  };

  const updateHeader = () => {
    if (selectRef.current && headerRef.current) {
      const selectedOption =
        selectRef.current.options[selectRef.current.selectedIndex];
      headerRef.current.innerHTML =
        arrowDownPrefix + (selectedOption?.text || 'Seleccionar');
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ display: 'none' }}
      >
        <option value="">Seleccionar</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      <p
        id={id ? `${id}-rpgui-dropdown-head` : undefined}
        className="rpgui-dropdown-imp rpgui-dropdown-imp-header"
        ref={headerRef}
        onClick={toggleDropdown}
        dangerouslySetInnerHTML={{ __html: arrowDownPrefix + 'Seleccionar' }}
      />

      <ul
        id={id ? `${id}-rpgui-dropdown` : undefined}
        className="rpgui-dropdown-imp listSize"
        ref={listRef}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {options.map(
          (option, index) =>
            option && (
              <li
                key={index}
                onClick={() => handleOptionClick(option, index)}
                dangerouslySetInnerHTML={{ __html: option }}
              />
            ),
        )}
      </ul>
    </div>
  );
};

export default Dropdown;
