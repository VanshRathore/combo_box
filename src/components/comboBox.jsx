import { useState, useRef } from "react";
import foodMenu from "../foodMenu.json";
import "../styles/ComboBox.css"; 

const ComboBox = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef(null);

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filtered = foodMenu.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOptions(filtered);
    setIsOpen(filtered.length > 0);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (!isOpen || filteredOptions.length === 0) return;
  
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : prev;
          scrollToOption(nextIndex);
          return nextIndex;
        });
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : prev;
          scrollToOption(nextIndex);
          return nextIndex;
        });
        break;
      case "Enter":
        if (highlightedIndex >= 0) {
          setInputValue(filteredOptions[highlightedIndex]);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };
  const scrollToOption = (index) => {
    if (listRef.current) {
      const optionElement = listRef.current.children[index];
      if (optionElement) {
        optionElement.scrollIntoView({ block: "nearest" });
      }
    }
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    setIsOpen(false);
  };

  return (
    <div className="combo-box">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="combo-input"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        placeholder="Search food..."
      />
      {isOpen && (
        <ul ref={listRef} className="combo-list" role="listbox">
          {filteredOptions.map((option, index) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`combo-option ${
                highlightedIndex === index ? "highlighted" : ""
              }`}
              role="option"
              aria-selected={highlightedIndex === index}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComboBox;
