const Box = ({ value }) => {
  return (
    <div className={value === "X" || value === "O" ? "box" : "box label"}>
      {value}
    </div>
  )
}

export default Box;