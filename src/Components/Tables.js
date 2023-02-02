import Table from 'react-bootstrap/Table';

function BasicExample({itemId,name,email}) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{itemId}</td>
          <td>{name}</td>
          <td>{email}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default BasicExample;