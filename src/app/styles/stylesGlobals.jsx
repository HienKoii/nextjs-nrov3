import styled from "styled-components";

export const PRIMARY_COLOR_BG = "rgba(255, 204, 204, 0.8)";
export const PRIMARY_COLOR = "#fce5e5";
export const PRIMARY_BORDER_COLOR = "#ffecb5";

export const ContainerMain = styled.div`
  border-radius: 10px;
  height: 100%;
  box-shadow: 0 0 15px #66ffff;
  overflow: hidden;
`;
export const BoxPage = styled.div`
  background-color: ${PRIMARY_COLOR_BG};
  border: 2px solid ${PRIMARY_BORDER_COLOR};
  border-radius: 8px;
`;
export const Box = styled.div`
  border-radius: 16px;
  background-color: ${PRIMARY_COLOR_BG};
  text-align: center;
  padding: 12px 0;
  box-shadow: 0px 2px 5px black;
`;
export const Divider = styled.div`
  border-top: 2px solid #6c757d;
  margin: 14px 8px;
  border-radius: 8px;
`;

export const CommentContent = styled.div`
  position: relative;
  width: 100%;
`;
export const CommentText = styled.div`
  background-color: #f1f1f1;
  padding: 10px 15px;
  border-radius: 10px;
  position: relative;
`;
export const CommentArrow = styled.div`
  position: absolute;
  left: -9px;
  top: 15px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #f1f1f1;
`;

export const WrapperImgs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  img {
    max-width: 100%;
    object-fit: cover;
  }
`;

export const FloatingContainerStyled = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

export const FloatingItemStyled = styled.div`
  border-radius: 999999px;
  overflow: hidden;
  cursor: pointer;
`;
