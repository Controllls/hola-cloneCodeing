import { Collapse, Checkbox, Card, Button } from "antd";
import { Icon, Menu, Badge, Avatar } from "antd";
import React, { useState } from "react";

const { Panel } = Collapse;

function CheckBox(props) {
  const [Checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    //누른 것의 index를 구하고
    const currentIndex = Checked.indexOf(value);

    //전체 checked 된 state 에서 현제 누른 checkbos가 이미있다면
    const newChecked = [...Checked];
    //state에 넣어준다
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      //빼주고
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
  };

  const newStyle = {
    width: 150,
    height: 60,
    borderRadius: 15,
    margin: 7,
  };

  const renderCheckBoxList = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        {/* <Checkbox
          onChange={() => handleToggle(value._id)}
          checked={Checked.indexOf(value._id) === -1 ? false : true}
        > */}
        <Button
          style={newStyle}
          type={Checked.indexOf(value._id) === -1 ? "default" : "primary"}
          onClick={() => handleToggle(value._id)}
          checked={Checked.indexOf(value._id) === -1 ? false : true}
        >
          <h3>{value.name}</h3>
        </Button>
        {/* </Checkbox> */}
        {/* <button>{value.name}</button> */}
      </React.Fragment>
    ));

  return (
    <div>
      <div>{renderCheckBoxList()}</div>
    </div>
  );
}

export default CheckBox;
