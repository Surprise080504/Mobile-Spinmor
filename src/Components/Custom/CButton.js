import React from 'react'
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(() => ({
  btnDiv: {
    width: "100%",
    margin: "10px 0",

  },
  btn: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px 0",
    width: "100%",
    // outline: "none",
    color: "white",
    backgroundColor: "rgb(6, 84, 185)",
    padding: "10px 0",
    borderColor: "rgb(6, 84, 185)",
    borderRadius: "5px"
  },
  btnIcon: {
    marginRight: "20px"
  }
}));

const CButton = ({ imgURL, text, blur }) => {
  const classes = useStyles();
  return (
    <div className={classes.btn} style={{ backgroundColor: !blur ? "rgb(6, 84, 185)" : "rgb(74, 128, 200)" }}>
      {/* <button type="button" className={classes.btn}> */}
      <img src={imgURL} className={classes.btnIcon} alt="icon" width="20px" />{text}
      {/* </button> */}
    </div>
  )
}

export default CButton