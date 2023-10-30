import { useStocksValue } from '@store/reducer';
import { styled } from 'styled-components';

export default function StatusBoardModalContent() {
  const stocks = useStocksValue();

  return (
    <Stocks>
      <thead>
        <tr>
          <th>이름</th>
          <th>테마</th>
          <th>가격</th>
          <th>수량</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => (
          <tr key={stock.name}>
            <td>{stock.name}</td>
            <td>{stock.theme}</td>
            <td>{stock.price}</td>
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
    padding: 0.5rem 1.5rem;
    border: 1px solid ${({ theme }) => theme.color.neutralBorderStrong};
  }
`;
