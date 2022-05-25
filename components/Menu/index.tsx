import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './style';
interface Props {
  onCloseModal: (e:any) => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<Props> = ({children, style, onCloseModal, closeButton = true}) => {
  const stopPropagation = useCallback((e)=>{
    e.stopPropagation();
  },[])
  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  )
}    


export default Menu;