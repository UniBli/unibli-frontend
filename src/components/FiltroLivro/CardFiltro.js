// CSS scoped
import styles from "./styles/CardFiltro.module.css";
import React from "react";

const CardFiltro = ({
  titulo,
  lista = [],
  valueKey = "nome", // qual campo usar como valor/label
  idKey = "id",      // qual campo usar como chave única
  selected = [],
  setSelected,
}) => {
  const handleCheckboxChange = (item) => {
    const value = item[valueKey] ?? item;
    const id = item[idKey] ?? value;

    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      // seleção múltipla
      setSelected([...selected, value]);
      
      // seleção única (radio behavior)
      //setSelected([value]);
    }
  };

  return (
    <div className={styles.container}>
      <h3>{titulo}</h3>

      <div className={styles.divCardFiltro}>
        <div className={styles.cardFiltroContent} >
        {Array.isArray(lista) &&
          lista.map((item, index) => {
            const id = item[idKey] ?? `${titulo}-${index}`;
            const value = item[valueKey] ?? item;

            return (
                <label className={styles.lblCheckbox}  key={`${titulo}-${id}`}>
                    <input
                    type="checkbox"
                    value={value}
                    onChange={() => handleCheckboxChange(item)}
                    checked={selected.includes(value)}
                    />
                    <p>
                     {value}
                    </p>
                </label>
            );
        })}
        </div>
      </div>
    </div>
  );
};

export default CardFiltro;
