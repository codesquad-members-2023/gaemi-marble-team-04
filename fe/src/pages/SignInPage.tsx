import { postSignin } from '@api/index';
import { ROUTE_PATH } from '@router/constants';
import {
  useSetAccessToken,
  useSetPlayer,
  useSetRefreshToken,
} from '@store/index';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

export default function SignInPage() {
  const [playerId, setPlayerId] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const setPlayer = useSetPlayer();
  const setAccessToken = useSetAccessToken();
  const setRefreshToken = useSetRefreshToken();

  const isValidId = /^[A-Za-z0-9]{6,20}$/.test(playerId);
  const isValidPassword = /^[A-Za-z0-9]{6,20}$/.test(password);
  const isSubmitDisabled = !isValidId || !isValidPassword;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const res = await postSignin(playerId, password);

    if (res.status === 200) {
      setPlayer(res.data.playerId);
      setAccessToken(res.headers['authorization']);
      setRefreshToken(res.headers['refresh-token']);
    }
    // TODO: 로그인시 에러 처리
  };

  const handleClickSignUpBtn = () => {
    navigate(ROUTE_PATH.SIGNUP);
  };

  return (
    <Container>
      <Title>Gaemi Marble</Title>
      <SignInForm onSubmit={handleSubmit}>
        <InputWrapper>
          <Input>
            <span>아이디</span>
            <input
              aria-label="아이디"
              type="text"
              name="playerId"
              value={playerId}
              onChange={(event) => {
                setPlayerId(event.target.value);
              }}
            />
          </Input>
          <Input>
            <span>비밀번호</span>
            <input
              aria-label="비밀번호"
              type="password"
              name="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </Input>
        </InputWrapper>
        <Button type="submit" disabled={isSubmitDisabled}>
          로그인
        </Button>
      </SignInForm>
      <Button onClick={handleClickSignUpBtn}>회원가입</Button>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme: { fontSize } }) => fontSize.xLarge};
`;

const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const Input = styled.label`
  span {
    margin-right: 8px;
  }

  input {
    margin-right: 8px;
    color: black;
  }
`;

const Button = styled.button`
  width: 200px;
  height: 50px;
  border: 1px solid;
  border-color: ${({ theme: { color } }) => color.accentText};
  border-radius: ${({ theme: { radius } }) => radius.medium};
  font-size: ${({ theme: { fontSize } }) => fontSize.medium};
  cursor: pointer;

  &:hover {
    color: ${({ theme: { color } }) => color.neutralTextStrong};
    border-color: ${({ theme: { color } }) => color.neutralTextStrong};
    background-color: ${({ theme: { color } }) => color.neutralBackground};
  }

  &:disabled {
    color: ${({ theme: { color } }) => color.neutralBackgroundBold};
    border-color: ${({ theme: { color } }) => color.neutralBorder};
    background-color: ${({ theme: { color } }) => color.systemBackground};
    cursor: default;
  }
`;
