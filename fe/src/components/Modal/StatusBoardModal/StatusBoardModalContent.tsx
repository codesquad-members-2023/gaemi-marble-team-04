import { cellImageMap } from '@assets/images';
import { useStocksValue } from '@store/reducer';
import { addCommasToNumber } from '@utils/index';
import { styled } from 'styled-components';

export default function StatusBoardModalContent() {
  const stocks = useStocksValue();

  return (
    <Stocks>
      <thead>
        <tr>
          <th>로고</th>
          <th>이름</th>
          <th>테마</th>
          <th>가격</th>
          <th>수량</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => (
          <tr key={stock.name}>
            <td>
              <Logo src={cellImageMap[stock.logo]} />
            </td>
            <td>{stock.name}</td>
            <td>{stock.theme}</td>
            <td>{addCommasToNumber(stock.price)}</td>
            <td>{stock.quantity}</td>
          </tr>
        ))}
      </tbody>
    </Stocks>
  );
}

const Stocks = styled.table`
  border: 1px solid ${({ theme }) => theme.color.neutralBorderStrong};

  thead {
    border-bottom: 1px solid ${({ theme }) => theme.color.neutralBorderStrong};
    height: 3rem;

    th {
      color: ${({ theme }) => theme.color.accentText};
      background-color: ${({ theme }) => theme.color.accentSecondary};
    }
  }

  th,
  td {
    padding: 0.3rem 1.5rem;
    border: 1px solid ${({ theme }) => theme.color.neutralBorderStrong};
  }
`;

const Logo = styled.img`
  width: 1.5rem;
`;
