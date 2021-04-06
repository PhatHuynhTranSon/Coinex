import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";
import { MarginBottomLarge } from "../components/spacing";
import MyTypograhpy from "../components/typography";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const LoadingScreen = ({ message }) => {
    return (
        <Wrapper>
            <MarginBottomLarge>
                <CircularProgress />
            </MarginBottomLarge>
            <MyTypograhpy variant="h4" component="h4">{ message }</MyTypograhpy>
        </Wrapper>
    );
}

export default LoadingScreen;