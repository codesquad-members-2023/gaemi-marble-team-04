import { Outlet } from 'react-router-dom';
import { styled } from 'styled-components';

export default function Layout() {
  return (
    <Page>
      <Outlet />
    </Page>
  );
}

const Page = styled.div`
  width: max-content;
  height: max-content;
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: ${({ theme: { color } }) => color.accentText};
  background-color: ${({ theme: { color } }) => color.accentPrimary};
`;
